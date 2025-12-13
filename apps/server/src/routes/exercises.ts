import { Router } from "express";
import prisma from "@gymApp/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { muscle, equipment, search } = req.query;

    const where: any = {};
    if (muscle) {
      where.primaryMuscle = { name: { equals: muscle as string, mode: 'insensitive' } };
    }
    if (equipment) {
      where.equipment = { contains: equipment as string, mode: 'insensitive' };
    }
    if (search) {
      where.name = { contains: search as string, mode: 'insensitive' };
    }

    const exercises = await prisma.exercise.findMany({
      where,
      include: {
        primaryMuscle: true,
      },
      take: 50,
    });

    res.json(exercises);
  } catch (error) {
    console.error("Exercises fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
