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
        secondaryMuscle: true,
      },
      take: 50,
    });

    res.json(exercises);
  } catch (error) {
    console.error("Exercises fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        primaryMuscle: true,
        secondaryMuscle: true,
      },
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.json(exercise);
  } catch (error) {
    console.error("Exercise fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
