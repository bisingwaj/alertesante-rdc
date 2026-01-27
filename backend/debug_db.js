
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DB CHECK START ---');
    try {
        // 1. Check connection and table existence
        const count = await prisma.ticket.count();
        console.log(`✅ Connection success. Ticket count: ${count}`);

        // 2. Try to force schema reload via raw SQL
        console.log('🔄 Attempting NOFITY pgrst...');
        await prisma.$executeRawUnsafe("NOTIFY pgrst, 'reload schema';");
        console.log('✅ NOTIFY sent.');

        // 3. Check permissions (Grants)
        console.log('🛡️ Applying Grants...');
        await prisma.$executeRawUnsafe(`
      GRANT ALL ON TABLE "Ticket" TO anon;
    `);
        await prisma.$executeRawUnsafe(`
      GRANT ALL ON TABLE "Ticket" TO authenticated;
    `);
        await prisma.$executeRawUnsafe(`
      GRANT ALL ON TABLE "Ticket" TO service_role;
    `);
        console.log('✅ Grants applied.');

    } catch (e) {
        console.error('❌ ERROR:', e);
    } finally {
        await prisma.$disconnect();
        console.log('--- DB CHECK END ---');
    }
}

main();
