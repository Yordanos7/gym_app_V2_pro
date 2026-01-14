import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL || "";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Updating exercises with scientific metadata...");

  const exercisesData = [
    {
      name: "Bench Press",
      description: "A fundamental compound movement for upper body power, primarily targeting the pectoralis major.",
      difficulty: "INTERMEDIATE",
      mechanics: "COMPOUND",
      force: "PUSH",
      equipment: "Barbell",
      tips: "Keep your feet planted firmly on the ground. Retract your scapula (squeeze shoulder blades together) to create a stable base. Touch the bar to your chest at the nipple line and drive up explosively.",
      mistakes: "Lifting the glutes off the bench, bouncing the bar off the chest, and flaring the elbows out at 90 degrees."
    },
    {
      name: "Squat",
      description: "Often called the king of all exercises, the back squat builds massive lower body strength and core stability.",
      difficulty: "ADVANCED",
      mechanics: "COMPOUND",
      force: "PUSH",
      equipment: "Barbell",
      tips: "Break at the hips and knees simultaneously. Keep your chest up and back flat. Descend until your thighs are parallel to the floor or slightly below. Drive through your heels.",
      mistakes: "Rounding the lower back, knees caving inward (valgus), and failing to reach proper depth."
    },
    {
      name: "Deadlift",
      description: "The ultimate test of raw strength, engaging almost every muscle in the posterior chain.",
      difficulty: "ADVANCED",
      mechanics: "COMPOUND",
      force: "PULL",
      equipment: "Barbell",
      tips: "The bar should remain in contact with your legs throughout the lift. Engage your lats by 'pulling' the slack out of the bar before lifting. Keep your spine neutral.",
      mistakes: "Rounding the back during the lift, jerking the bar off the ground, and excessive leaning back at the top."
    },
    {
      name: "Push Up",
      description: "A versatile bodyweight exercise that builds chest, shoulder, and tricep endurance while improving core stability.",
      difficulty: "BEGINNER",
      mechanics: "COMPOUND",
      force: "PUSH",
      equipment: "Bodyweight",
      tips: "Maintain a straight line from head to heels. Tuck your elbows at a 45-degree angle. Lower yourself until your chest nearly touches the floor.",
      mistakes: "Sagging hips, head leaning forward, and half-reps (not going low enough)."
    }
  ];

  for (const data of exercisesData) {
    await prisma.exercise.updateMany({
      where: { name: data.name },
      data: {
        description: data.description,
        difficulty: data.difficulty as any,
        mechanics: data.mechanics as any,
        force: data.force as any,
        tips: data.tips,
        mistakes: data.mistakes
      }
    });
  }

  console.log("Scientific metadata seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
