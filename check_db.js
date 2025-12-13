import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: 'postgresql://postgres:password@localhost:5432/gymApp?schema=public',
});

async function checkTables() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in DB:', res.rows.map(r => r.table_name));
  } catch (err) {
    console.error('Error connecting:', err);
  } finally {
    await client.end();
  }
}

checkTables();
