/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - Added the required column `paymentMethod` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PaymenyMethod" AS ENUM ('BANK_TRANSFER', 'PAYMENT_ON_ARRIVAL');

-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "paymentMethod" "public"."PaymenyMethod" NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "dateOfBirth",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber",
ADD COLUMN     "fullName" TEXT NOT NULL;
