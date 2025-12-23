
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:password@localhost:5432/gymApp?schema=public',
});

async function seed() {
  try {
    await client.connect();
    console.log('Connected to database...');

    // 1. Insert Muscles
    console.log('Seeding Muscles...');
    const muscles = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Abs', 'Cardio'];
    const muscleIds = {};
    
    for (const name of muscles) {
      const res = await client.query(
        `INSERT INTO "Muscle" (id, name) VALUES (gen_random_uuid(), $1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
        [name]
      );
      muscleIds[name] = res.rows[0].id;
    }

    // 2. Insert Exercises
    console.log('Seeding Exercises...');
    const exercises = [
      { name: 'Bench Press', muscle: 'Chest', desc: 'Barbell bench press' },
      { name: 'Push Up', muscle: 'Chest', desc: 'Standard push up' },
      { name: 'Squat', muscle: 'Legs', desc: 'Barbell back squat' },
      { name: 'Deadlift', muscle: 'Back', desc: 'Conventional deadlift' },
      { name: 'Pull Up', muscle: 'Back', desc: 'Bodyweight pull up' },
      { name: 'Overhead Press', muscle: 'Shoulders', desc: 'Standing barbell press' },
      { name: 'Dumbbell Curl', muscle: 'Arms', desc: 'Standing dumbbell curl' },
      { name: 'Tricep Dip', muscle: 'Arms', desc: 'Parallel bar dip' },
      { name: 'Plank', muscle: 'Abs', desc: 'Forearm plank' },
      { name: 'Running', muscle: 'Cardio', desc: 'Treadmill or outdoor run' },
    ];

    const exerciseIds = {};
    for (const ex of exercises) {
      // Check if exists first to avoid duplicate names if unique constraint isn't there (it's not on name in schema, but good practice)
      // Actually schema doesn't enforce unique name on Exercise, but let's try to find it first.
      let res = await client.query(`SELECT id FROM "Exercise" WHERE name = $1`, [ex.name]);
      if (res.rows.length === 0) {
        res = await client.query(
          `INSERT INTO "Exercise" (id, name, description, "primaryMuscleId") VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id`,
          [ex.name, ex.desc, muscleIds[ex.muscle]]
        );
      }
      exerciseIds[ex.name] = res.rows[0].id;
    }

    // 3. Insert Program: Beginner Full Body
    console.log('Seeding Program: Beginner Full Body...');
    let programId;
    const progRes = await client.query(`SELECT id FROM "Program" WHERE name = 'Beginner Full Body'`);
    if (progRes.rows.length > 0) {
        programId = progRes.rows[0].id;
        console.log('Program already exists, skipping creation.');
    } else {
        const newProg = await client.query(
            `INSERT INTO "Program" (id, name, description, difficulty, "updatedAt") VALUES (gen_random_uuid(), 'Beginner Full Body', 'A 3-day full body split perfect for beginners.', 'BEGINNER', NOW()) RETURNING id`
        );
        programId = newProg.rows[0].id;

        // Day 1
        const day1 = await client.query(
            `INSERT INTO "ProgramDay" (id, "programId", "dayOfWeek", title) VALUES (gen_random_uuid(), $1, 1, 'Full Body A') RETURNING id`,
            [programId]
        );
        const day1Id = day1.rows[0].id;
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [day1Id, exerciseIds['Squat']]);
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [day1Id, exerciseIds['Bench Press']]);
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [day1Id, exerciseIds['Pull Up']]);

        // Day 2
        const day2 = await client.query(
            `INSERT INTO "ProgramDay" (id, "programId", "dayOfWeek", title) VALUES (gen_random_uuid(), $1, 3, 'Full Body B') RETURNING id`,
            [programId]
        );
        const day2Id = day2.rows[0].id;
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [day2Id, exerciseIds['Deadlift']]);
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [day2Id, exerciseIds['Overhead Press']]);
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [day2Id, exerciseIds['Plank']]);
    }

    // 4. Insert Program: Upper/Lower Split
    console.log('Seeding Program: Upper/Lower Split...');
    const prog2Res = await client.query(`SELECT id FROM "Program" WHERE name = 'Upper/Lower Split'`);
    if (prog2Res.rows.length === 0) {
        const newProg2 = await client.query(
            `INSERT INTO "Program" (id, name, description, difficulty, "updatedAt") VALUES (gen_random_uuid(), 'Upper/Lower Split', '4-day split focusing on upper and lower body separately.', 'INTERMEDIATE', NOW()) RETURNING id`
        );
        const prog2Id = newProg2.rows[0].id;
        
        // Upper
        const dayUpper = await client.query(
            `INSERT INTO "ProgramDay" (id, "programId", "dayOfWeek", title) VALUES (gen_random_uuid(), $1, 1, 'Upper Power') RETURNING id`,
            [prog2Id]
        );
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [dayUpper.rows[0].id, exerciseIds['Bench Press']]);
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [dayUpper.rows[0].id, exerciseIds['Pull Up']]);
        
        // Lower
        const dayLower = await client.query(
            `INSERT INTO "ProgramDay" (id, "programId", "dayOfWeek", title) VALUES (gen_random_uuid(), $1, 2, 'Lower Power') RETURNING id`,
            [prog2Id]
        );
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [dayLower.rows[0].id, exerciseIds['Squat']]);
        await client.query(`INSERT INTO "ProgramExercise" (id, "programDayId", "exerciseId") VALUES (gen_random_uuid(), $1, $2)`, [dayLower.rows[0].id, exerciseIds['Deadlift']]);
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.end();
  }
}

seed();
