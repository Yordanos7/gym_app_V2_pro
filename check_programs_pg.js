
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:password@localhost:5432/gymApp?schema=public',
});

async function check() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT p.name, p.difficulty, count(pd.id) as days
      FROM "Program" p
      LEFT JOIN "ProgramDay" pd ON p.id = pd."programId"
      GROUP BY p.id, p.name, p.difficulty
    `);
    console.log('Programs in DB:');
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

check();
