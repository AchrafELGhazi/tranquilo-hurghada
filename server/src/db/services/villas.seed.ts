import { parse } from "csv-parse";
import fs from 'fs'
import path from "path";
import { VillaStatus } from "@prisma/client";
import logger from "../../config/logger";
import prisma from "../../config/database";
import { Decimal } from "@prisma/client/runtime/library";

const seedVillas = async () => {
    logger.info("Seeding villas from CSV...")
    const filePath = path.join(__dirname, '../seeds/villas.csv');
    const fileStream = fs.createReadStream(filePath);

    const parser = fileStream.pipe(
        parse({
            columns: true,
            trim: true,
        })
    );

    for await (const row of parser) {
        try {
            const pricePerNight = new Decimal(row.pricePerNight);

            const amenities = row.amenities && row.amenities.trim() !== ''
                ? row.amenities.split('|').map((amenity: string) => amenity.trim())
                : [];

            const images = row.images && row.images.trim() !== ''
                ? row.images.split('|').map((image: string) => image.trim())
                : [];

            const maxGuests = parseInt(row.maxGuests);
            const bedrooms = parseInt(row.bedrooms);
            const bathrooms = parseInt(row.bathrooms);

            const ownerExists = await prisma.user.findUnique({
                where: { id: row.ownerId }
            });

            if (!ownerExists) {
                logger.warn(`Owner ${row.ownerId} not found for villa ${row.title}, skipping...`);
                continue;
            }

            await prisma.villa.create({
                data: {
                    id: row.id,
                    title: row.title,
                    description: row.description || null,
                    address: row.address,
                    city: row.city,
                    country: row.country || "Morocco",
                    pricePerNight: pricePerNight,
                    maxGuests: maxGuests,
                    bedrooms: bedrooms,
                    bathrooms: bathrooms,
                    amenities: amenities,
                    images: images,
                    status: row.status as VillaStatus,
                    isActive: row.isActive === 'true',
                    ownerId: row.ownerId,
                    createdAt: new Date(row.createdAt),
                    updatedAt: new Date(row.updatedAt),
                }
            });

            logger.info(`Inserted villa: ${row.title} in ${row.city}`);

        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error(`Error inserting villa ${row.title}:`, error.message);
            } else {
                logger.error(`Error inserting villa ${row.title}:`, String(error));
            }
        }
    }

    logger.info("Villas seeding completed!");
}

export default seedVillas;