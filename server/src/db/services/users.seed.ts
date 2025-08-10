import { parse } from "csv-parse";
import fs from 'fs'
import path from "path";
import { Role } from "@prisma/client";
import logger from "../../config/logger";
import prisma from "../../config/database";
import { hashPassword } from "../../utils/password";

const seedUsers = async () => {
    logger.info("Seeding users from CSV...")
    const filePath = path.join(__dirname, '../seeds/users.csv');
    const fileStream = fs.createReadStream(filePath);

    const parser = fileStream.pipe(
        parse({
            columns: true,
            trim: true,
        })
    );

    for await (const row of parser) {
        try {
            const hashedPassword = await hashPassword(row.password);

            const dateOfBirth = row.dateOfBirth && row.dateOfBirth.trim() !== ''
                ? new Date(row.dateOfBirth)
                : null;

            const phone = row.phone && row.phone.trim() !== ''
                ? row.phone.trim()
                : null;

            await prisma.user.create({
                data: {
                    id: row.id,
                    email: row.email,
                    password: hashedPassword,
                    fullName: row.fullName,
                    dateOfBirth: dateOfBirth,
                    phone: phone,
                    role: row.role as Role,
                    isActive: row.isActive === 'true',
                    createdAt: new Date(row.createdAt),
                    updatedAt: new Date(row.updatedAt),
                }
            });

            logger.info(`Inserted user: ${row.email} with ID: ${row.id}`);

        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error(`Error inserting ${row.email}:`, error.message);
            } else {
                logger.error(`Error inserting ${row.email}:`, String(error));
            }
        }
    }

    logger.info("Users seeding completed!");
}

export default seedUsers;