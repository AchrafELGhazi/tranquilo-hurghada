import logger from "../config/logger";
import prisma from "../config/database";
import seedUsers from "./services/users.seed";


const seed = async () => {
     try {
          logger.info('Starting seeding data from seeds...');

          await prisma.user.deleteMany();

          await seedUsers();
          logger.info('Seeding completed successfully');


     } catch (error) {
          logger.error('Seeding failed', error);

     } finally {
          await prisma.$disconnect;
     }
}

seed();



