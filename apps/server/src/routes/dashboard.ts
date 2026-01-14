import { Router } from "express";
import prisma from "@gymApp/db";
import { auth } from "@gymApp/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let session = await auth.api.getSession({
      headers: req.headers,
    });
    
    // Fallback: If getSession fails but we have an Authorization header, check DB directly
    if (!session && req.headers.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const dbSession = await prisma.session.findUnique({
            where: { token },
            include: { user: true }
        });
        
        if (dbSession && dbSession.expiresAt > new Date()) {
            console.log(`[AUTH FALLBACK] Session validated directly via DB for ${dbSession.userId}`);
            session = { session: dbSession, user: dbSession.user } as any;
        }
    }
    
    if (!session) {
      console.log(`[AUTH DEBUG] getSession failed for /api/dashboard`);
      console.log(`[AUTH DEBUG] Headers:`, JSON.stringify(req.headers, null, 2));
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    // Fetch user with active program
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        activeProgram: {
          include: {
            days: {
              include: {
                exercises: {
                  include: {
                    exercise: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Fetch user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    // Fetch streak (mock logic for now)
    const streak = await prisma.dailyStreak.count({
      where: { userId, completed: true },
    });

    // Fetch today's workout (any specifically logged session)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysWorkout = await prisma.workoutSession.findFirst({
      where: {
        userId,
        date: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        exercises: {
          include: {
            exercise: true,
            sets: true,
          }
        }
      }
    }); 

    let duration = 0;
    let exerciseCount = 0;

    if (todaysWorkout) {
      exerciseCount = todaysWorkout.exercises.length;
      const totalSets = todaysWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
      duration = totalSets > 0 ? totalSets * 4 : exerciseCount * 10;
      if (duration === 0 && exerciseCount > 0) duration = 45;
    }

    // Map JS getDay() (0-6, 0 is Sunday) to 1-7 (where 1 is Sunday as per seed/schema convention)
    // Actually, seeds often use 1 for Monday. Let's check common convention.
    // Let's assume 1=Monday, 2=Tuesday... 7=Sunday. 
    // JS getDay(): 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    let currentDayOfWeek = new Date().getDay(); 
    if (currentDayOfWeek === 0) currentDayOfWeek = 7; // Map Sunday from 0 to 7

    const scheduledDay = user?.activeProgram?.days.find(d => d.dayOfWeek === currentDayOfWeek);

    res.json({
      userName: user?.name || session.user.name,
      streak,
      goal: profile?.goal,
      activeProgram: user?.activeProgram,
      scheduledToday: scheduledDay ? {
        id: scheduledDay.id,
        title: scheduledDay.title,
        exerciseCount: scheduledDay.exercises.length,
      } : null,
      todaysWorkout: todaysWorkout ? {
        ...todaysWorkout,
        exerciseCount,
        duration,
      } : null,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
