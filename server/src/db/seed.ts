import logger from "../config/logger";
import prisma from "../config/database";
import seedUsers from "./services/users.seed";
import seedVillas from "./services/villas.seed";
import seedServices from "./services/services.seed";

const seed = async () => {
    try {
        logger.info('Starting seeding data from seeds...');

        logger.info('Clearing existing data...');
        await prisma.bookingService.deleteMany();
        await prisma.booking.deleteMany();
        await prisma.service.deleteMany();
        await prisma.villa.deleteMany();
        await prisma.user.deleteMany();

        logger.info('Seeding users...');
        await seedUsers();

        logger.info('Seeding villas...');
        await seedVillas();

        logger.info('Seeding services...');
        await seedServices();

        logger.info('Seeding completed successfully');
    } catch (error) {
        logger.error('Seeding failed', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seed();