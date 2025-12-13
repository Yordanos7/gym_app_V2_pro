import { Router } from "express";
import prisma from "@gymApp/db";
import { auth } from "@gymApp/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { id: userId } = session.user;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const meals = await prisma.meal.findMany({
      where: {
        userId,
        date: { gte: today },
      },
    });

    res.json(meals);
  } catch (error) {
    console.error("Fetch meals error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { id: userId } = session.user;
    const { type, calories, protein } = req.body;

    const meal = await prisma.meal.create({
      data: {
        userId,
        type,
        calories: parseInt(calories),
        protein: parseInt(protein),
      },
    });

    res.json(meal);
  } catch (error) {
    console.error("Log meal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
