import { parse } from "csv-parse";
import fs from 'fs'
import path from "path";
import { ServiceCategory, ServiceDifficulty } from "@prisma/client";
import logger from "../../config/logger";
import prisma from "../../config/database";
import { Decimal } from "@prisma/client/runtime/library";

const seedServices = async () => {
    logger.info("Seeding services from CSV...")
    const filePath = path.join(__dirname, '../seeds/services.csv');
    const fileStream = fs.createReadStream(filePath);

    const parser = fileStream.pipe(
        parse({
            columns: true,
            trim: true,
        })
    );

    for await (const row of parser) {
        try {
            const price = new Decimal(row.price);

            const highlights = row.highlights && row.highlights.trim() !== ''
                ? row.highlights.split('|').map((highlight: string) => highlight.trim())
                : [];

            const included = row.included && row.included.trim() !== ''
                ? row.included.split('|').map((item: string) => item.trim())
                : [];

            const maxGroupSize = row.maxGroupSize && row.maxGroupSize.trim() !== ''
                ? parseInt(row.maxGroupSize)
                : null;

            if (row.villaId && row.villaId.trim() !== '') {
                const villaExists = await prisma.villa.findUnique({
                    where: { id: row.villaId }
                });

                if (!villaExists) {
                    logger.warn(`Villa ${row.villaId} not found for service ${row.title}, skipping...`);
                    continue;
                }
            }

            await prisma.service.create({
                data: {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    longDescription: row.longDescription || null,
                    category: row.category as ServiceCategory,
                    price: price,
                    duration: row.duration,
                    difficulty: row.difficulty && row.difficulty.trim() !== ''
                        ? row.difficulty as ServiceDifficulty
                        : null,
                    maxGroupSize: maxGroupSize,
                    highlights: highlights,
                    included: included,
                    image: row.image || null,
                    isActive: row.isActive === 'true',
                    isFeatured: row.isFeatured === 'true',
                    villaId: row.villaId && row.villaId.trim() !== '' ? row.villaId : null,
                    createdAt: new Date(row.createdAt),
                    updatedAt: new Date(row.updatedAt),
                }
            });

            logger.info(`Inserted service: ${row.title} (${row.category})`);

        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error(`Error inserting service ${row.title}:`, error.message);
            } else {
                logger.error(`Error inserting service ${row.title}:`, String(error));
            }
        }
    }

    logger.info("Services seeding completed!");
}

export default seedServices;