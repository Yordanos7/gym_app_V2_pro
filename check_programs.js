
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const programs = await prisma.program.findMany({
    include: { days: true }
  });
  console.log('Programs found:', programs.length);
  if (programs.length > 0) {
    console.log('First program:', JSON.stringify(programs[0], null, 2));
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
