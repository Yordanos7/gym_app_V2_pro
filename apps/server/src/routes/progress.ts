import { Router } from "express";
import prisma from "@gymApp/db";
import { auth } from "@gymApp/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { id: userId } = session.user;

    // Fetch weight history
    const weightHistory = await prisma.weightEntry.findMany({
      where: { userId },
      orderBy: { date: "asc" },
      take: 30, // Last 30 entries
    });

    // Fetch workout count by month (mock for now, or use raw query)
    const workouts = await prisma.workoutSession.count({
      where: { userId },
    });

    res.json({
      weightHistory,
      totalWorkouts: workouts,
    });
  } catch (error) {
    console.error("Progress fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
