import { Router } from "express";
import prisma from "@gymApp/db";
import { auth } from "@gymApp/auth";

const router = Router();

router.get("/", async (req, res) => {
  try {
    let session = await auth.api.getSession({ headers: req.headers });

    // Fallback: Check DB directly if official check fails (needed for mobile/CSRF)
    if (!session && req.headers.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const dbSession = await prisma.session.findUnique({
            where: { token },
            include: { user: true }
        });
        
        if (dbSession && dbSession.expiresAt > new Date()) {
            console.log(`[AUTH FALLBACK] /api/nutrition (GET) validated via DB`);
            session = { session: dbSession, user: dbSession.user } as any;
        }
    }

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
    let session = await auth.api.getSession({ headers: req.headers });

    // Fallback: Check DB directly if official check fails (needed for mobile/CSRF)
    if (!session && req.headers.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const dbSession = await prisma.session.findUnique({
            where: { token },
            include: { user: true }
        });
        
        if (dbSession && dbSession.expiresAt > new Date()) {
            console.log(`[AUTH FALLBACK] /api/nutrition (POST) validated via DB`);
            session = { session: dbSession, user: dbSession.user } as any;
        }
    }

    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { id: userId } = session.user;
    const { type, calories, protein } = req.body;

    // Safer numeric parsing (handle strings or already-parsed numbers)
    const numCalories = Number(calories);
    const numProtein = Number(protein) || 0;

    if (isNaN(numCalories)) {
        return res.status(400).json({ error: "Invalid energy count. Calories must be a number." });
    }

    const meal = await prisma.meal.create({
      data: {
        user: { connect: { id: userId } }, // Use connect relation to be 100% safe
        type,
        calories: Math.floor(numCalories),
        protein: Math.floor(numProtein),
      },
    });

    res.json(meal);
  } catch (error) {
    console.error("Log meal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let session = await auth.api.getSession({ headers: req.headers });

    // Fallback: Check DB directly if official check fails (needed for mobile/CSRF)
    if (!session && req.headers.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const dbSession = await prisma.session.findUnique({
            where: { token },
            include: { user: true }
        });
        
        if (dbSession && dbSession.expiresAt > new Date()) {
            console.log(`[AUTH FALLBACK] /api/nutrition (DELETE) validated via DB`);
            session = { session: dbSession, user: dbSession.user } as any;
        }
    }

    if (!session) return res.status(401).json({ error: "Unauthorized" });

    const { id: userId } = session.user;
    const { id } = req.params;

    // Verify ownership
    const meal = await prisma.meal.findUnique({
        where: { id }
    });

    if (!meal || meal.userId !== userId) {
        return res.status(403).json({ error: "Forbidden: You don't own this record" });
    }

    await prisma.meal.delete({
      where: { id },
    });

    res.json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Delete meal error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
