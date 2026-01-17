import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Muscles
  const muscles = [
    { name: "Chest" },
    { name: "Back" },
    { name: "Legs" },
    { name: "Shoulders" },
    { name: "Arms" },
    { name: "Core" },
    { name: "Cardio" },
  ];

  for (const m of muscles) {
    await prisma.muscle.upsert({
      where: { name: m.name },
      update: {},
      create: m,
    });
  }

  const chest = await prisma.muscle.findUnique({ where: { name: "Chest" } });
  const legs = await prisma.muscle.findUnique({ where: { name: "Legs" } });
  const back = await prisma.muscle.findUnique({ where: { name: "Back" } });

  // Exercises
  const exerciseData = [
    {
      name: "Bench Press",
      description: "Lie on a flat bench and press the bar up.",
      primaryMuscleId: chest!.id,
      equipment: "Barbell",
    },
    {
      name: "Squat",
      description: "Place bar on back and squat down.",
      primaryMuscleId: legs!.id,
      equipment: "Barbell",
    },
    {
      name: "Deadlift",
      description: "Lift bar from ground to hip level.",
      primaryMuscleId: back!.id,
      equipment: "Barbell",
    },
    {
      name: "Push Up",
      description: "Push body up from floor.",
      primaryMuscleId: chest!.id,
      equipment: "Bodyweight",
    },
  ];

  for (const ex of exerciseData) {
    await prisma.exercise.upsert({
        where: { id: `seed-${ex.name.toLowerCase().replace(/\s+/g, '-')}` }, // Using a stable ID for seeding
        update: ex,
        create: {
            id: `seed-${ex.name.toLowerCase().replace(/\s+/g, '-')}`,
            ...ex
        }
    });
  }

  // Program
  const program = await prisma.program.upsert({
    where: { id: "seed-beginner-full-body" },
    update: {},
    create: {
      id: "seed-beginner-full-body",
      name: "Beginner Full Body",
      description: "A simple 3-day full body routine.",
      difficulty: "BEGINNER",
    },
  });

  // Program Days
  const day1 = await prisma.programDay.upsert({
    where: { id: "seed-day-1" },
    update: {},
    create: {
      id: "seed-day-1",
      programId: program.id,
      title: "Day A",
      dayOfWeek: 1,
    },
  });

  // Add exercises to day
  const allExercises = await prisma.exercise.findMany();
  for (const ex of allExercises) {
    await prisma.programExercise.upsert({
      where: { 
        id: `seed-prog-ex-${ex.id}`
      },
      update: {},
      create: {
        id: `seed-prog-ex-${ex.id}`,
        programDayId: day1.id,
        exerciseId: ex.id,
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
