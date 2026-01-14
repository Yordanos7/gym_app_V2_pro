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

    // Fetch user profile
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    // Fetch streak (mock logic for now)
    const streak = await prisma.dailyStreak.count({
      where: { userId, completed: true },
    });

    // Fetch today's workout
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysWorkout = await prisma.workoutSession.findFirst({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
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
      // Estimate duration: 5 mins per exercise + 2 mins per set
      // Or simpler: 45 mins base if > 0, or just sum sets. 
      // Let's do: 5 mins per exercise as a rough estimate if no sets, 
      // or better: count total sets * 3 mins.
      const totalSets = todaysWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
      duration = totalSets > 0 ? totalSets * 4 : exerciseCount * 10; // Fallback to 10 mins per exercise if no sets logged yet
      if (duration === 0 && exerciseCount > 0) duration = 45; // Default if just planned
    }

    res.json({
      userName: session.user.name,
      streak,
      goal: profile?.goal,
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
