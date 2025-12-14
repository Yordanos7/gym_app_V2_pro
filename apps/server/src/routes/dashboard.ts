import { Router } from "express";
import prisma from "@gymApp/db";
import { auth } from "@gymApp/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
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
          }
        }
      }
    }); 

    res.json({
      userName: session.user.name,
      streak,
      goal: profile?.goal,
      todaysWorkout,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
