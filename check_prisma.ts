import fs from 'fs';
import 'dotenv/config';
import path from 'path';
import dotenv from 'dotenv';

// Load env from packages/db/.env manually
dotenv.config({ path: path.resolve(process.cwd(), 'packages/db/.env') });

async function main() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Dynamic import to ensure env is loaded first
    const { default: prisma } = await import('./packages/db/src/index');

    console.log('Checking User table...');
    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);

    console.log('Checking Session table...');
    const sessions = await prisma.session.findMany();
    console.log('Sessions found:', sessions.length);
  } catch (e: any) {
    console.error('Error querying Prisma:', e);
    fs.writeFileSync('error.log', JSON.stringify(e, null, 2) + '\n' + e.toString());
  } finally {
    // We can't easily disconnect since we don't have the instance if import failed
    // But for a script it's fine
    process.exit(0);
  }
}

main();
