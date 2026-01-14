import { Router } from "express";
import prisma from "@gymApp/db";
import { auth } from "@gymApp/auth";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { goal, level, gender, age, height, weight, activityLevel, equipment } = req.body;
    const userId = session.user.id;

    // Update UserProfile
    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        goal,
        level,
        activityLevel,
        age: parseInt(age),
        heightCm: parseInt(height),
        weightKg: parseFloat(weight),
      },
      update: {
        goal,
        level,
        activityLevel,
        age: parseInt(age),
        heightCm: parseInt(height),
        weightKg: parseFloat(weight),
      },
    });

    // Update UserEquipment
    // First delete existing, then create new
    await prisma.userEquipment.deleteMany({ where: { userId } });
    
    if (equipment && equipment.length > 0) {
      await prisma.userEquipment.createMany({
        data: equipment.map((name: string) => ({
          userId,
          name,
        })),
      });
    }

    // Update User gender if provided (it's on User model, not Profile)
    if (gender) {
      await prisma.user.update({
        where: { id: userId },
        data: { gender },
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const userId = session.user.id;

    // Fetch User with Profile and Streak
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        _count: {
          select: {
            workouts: true,
            achievements: true,
          }
        }
      }
    });

    // Calculate current streak (simplified: consecutive days with DailyStreak entries)
    const streaks = await prisma.dailyStreak.findMany({
      where: { userId, completed: true },
      orderBy: { date: 'desc' },
      take: 30
    });

    let currentStreak = 0;
    if (streaks.length > 0) {
        // Simple streak logic: count consecutive entries starting from today/yesterday
        currentStreak = streaks.length; // placeholder for real streak logic
    }

    res.json({
      name: user?.name || session.user.name,
      level: user?.profile?.level || "BEGINNER",
      stats: {
        sessions: user?._count.workouts || 0,
        streak: currentStreak,
        achievements: user?._count.achievements || 0,
        rank: user?.profile?.level === "ADVANCED" ? "ELITE" : user?.profile?.level === "INTERMEDIATE" ? "WARRIOR" : "RECRUIT"
      }
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
