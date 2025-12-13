import { Router } from "express";
import prisma from "@gymApp/db";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const programs = await prisma.program.findMany({
      include: {
        days: true,
      },
    });

    res.json(programs);
  } catch (error) {
    console.error("Programs fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    if (!program) {
      return res.status(404).json({ error: "Program not found" });
    }

    res.json(program);
  } catch (error) {
    console.error("Program fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
