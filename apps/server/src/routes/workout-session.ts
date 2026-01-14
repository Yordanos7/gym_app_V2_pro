import { Router } from "express";
import prisma from "@gymApp/db";
import { auth } from "@gymApp/auth";

const router = Router();

// Get a specific workout session
router.get("/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await prisma.workoutSession.findUnique({
      where: { id: sessionId },
      include: {
        exercises: {
            include: {
                exercise: true,
                sets: true
            }
        }
      }
    });
    
    if (!session) return res.status(404).json({ error: "Session not found" });

    res.json(session);
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start a workout session
router.post("/", async (req, res) => {
  try {
    let session = await auth.api.getSession({ headers: req.headers });
    
    // Fallback: Check DB directly if header is present but getSession failed
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
        console.log("Auth Failed for Workout Session");
        console.log("Headers:", JSON.stringify(req.headers, null, 2));
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { id: userId } = session.user;
    const { notes, date } = req.body;

    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId,
        notes,
        date: date ? new Date(date) : new Date(),
        status: 'STARTED',
      },
    });

    res.json(workoutSession);
  } catch (error) {
    console.error("Start workout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add an exercise to the session (or get existing)
router.post("/:sessionId/exercise", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { exerciseId } = req.body;

    let workoutExercise = await prisma.workoutExercise.findFirst({
      where: { workoutSessionId: sessionId, exerciseId },
    });

    if (!workoutExercise) {
      workoutExercise = await prisma.workoutExercise.create({
        data: {
          workoutSessionId: sessionId,
          exerciseId,
        },
      });
    }

    res.json(workoutExercise);
  } catch (error) {
    console.error("Add exercise error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Log a set
router.post("/:sessionId/set", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { exerciseId, reps, weight, note } = req.body;

    // Find or create workout exercise
    let workoutExercise = await prisma.workoutExercise.findFirst({
      where: { workoutSessionId: sessionId, exerciseId },
    });

    if (!workoutExercise) {
      workoutExercise = await prisma.workoutExercise.create({
        data: {
          workoutSessionId: sessionId,
          exerciseId,
        },
      });
    }

    const setEntry = await prisma.setEntry.create({
      data: {
        workoutExerciseId: workoutExercise.id,
        reps: parseInt(reps),
        weight: parseFloat(weight),
        note,
      },
    });

    res.json(setEntry);
  } catch (error) {
    console.error("Log set error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Finish workout
router.put("/:sessionId/finish", async (req, res) => {
    // In this simple schema, we just assume it's done. 
    // We could add an 'endedAt' field to WorkoutSession if needed.
    const { sessionId } = req.params;
    
    const session = await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        endedAt: new Date(),
      },
    });

    res.json(session);
});

export default router;
