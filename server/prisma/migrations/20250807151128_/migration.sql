/*
  Warnings:

  - Changed the type of `paymentMethod` on the `bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('BANK_TRANSFER', 'PAYMENT_ON_ARRIVAL');

-- AlterTable
ALTER TABLE "public"."bookings" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "public"."PaymentMethod" NOT NULL;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT;

-- DropEnum
DROP TYPE "public"."PaymenyMethod";
