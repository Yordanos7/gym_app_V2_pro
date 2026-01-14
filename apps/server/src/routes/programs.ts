import { Router } from "express";
import prisma from "@gymApp/db";

import { auth } from "@gymApp/auth";

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
    
    // Auth check to see if this is the active program
    let session = await auth.api.getSession({
      headers: req.headers,
    });
    
    if (!session && req.headers.authorization) {
        const token = req.headers.authorization.replace('Bearer ', '');
        const dbSession = await prisma.session.findUnique({
            where: { token },
            include: { user: true }
        });
        if (dbSession && dbSession.expiresAt > new Date()) {
            session = { session: dbSession, user: dbSession.user } as any;
        }
    }

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

    let isActive = false;
    if (session) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { activeProgramId: true }
      });
      isActive = user?.activeProgramId === id;
    }

    res.json({
      ...program,
      isActive
    });
  } catch (error) {
    console.error("Program fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/enroll", async (req, res) => {
  try {
    const { programId, userId } = req.body;

    if (!programId || !userId) {
      return res.status(400).json({ error: "Program ID and User ID are required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        activeProgramId: programId,
      },
    });

    res.json({ success: true, activeProgramId: updatedUser.activeProgramId });
  } catch (error) {
    console.error("Enrollment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/quit", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        activeProgramId: null,
      },
    });

    res.json({ success: true, activeProgramId: updatedUser.activeProgramId });
  } catch (error) {
    console.error("Quit program error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
