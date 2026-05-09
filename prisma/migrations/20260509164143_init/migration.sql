/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('labo', 'admin', 'donor');

-- CreateEnum
CREATE TYPE "StatusNotification" AS ENUM ('send', 'not_read');

-- CreateEnum
CREATE TYPE "StatusStock" AS ENUM ('normal', 'low', 'urgence');

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "id_user" SERIAL NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'donor',
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id_user");

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "BloodGroup" (
    "id_blood" SERIAL NOT NULL,
    "type_blood" TEXT NOT NULL,

    CONSTRAINT "BloodGroup_pkey" PRIMARY KEY ("id_blood")
);

-- CreateTable
CREATE TABLE "Donor" (
    "id_donor" SERIAL NOT NULL,
    "address" TEXT,
    "job" TEXT,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "photo" TEXT,
    "CIN" TEXT NOT NULL,
    "isApte" BOOLEAN NOT NULL DEFAULT false,
    "weight" DOUBLE PRECISION,
    "id_user" INTEGER NOT NULL,
    "id_blood" INTEGER,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id_donor")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id_analysis" SERIAL NOT NULL,
    "analysis_date" TIMESTAMP(3) NOT NULL,
    "result" TEXT,
    "attachment" TEXT,
    "observation" TEXT,
    "weight" DOUBLE PRECISION,
    "tension" TEXT,
    "id_donor" INTEGER NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id_analysis")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id_donation" SERIAL NOT NULL,
    "donation_date" TIMESTAMP(3) NOT NULL,
    "bags_qty" INTEGER NOT NULL,
    "id_donor" INTEGER NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id_donation")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id_stock" SERIAL NOT NULL,
    "bags" INTEGER NOT NULL,
    "status_stock" "StatusStock" NOT NULL DEFAULT 'normal',
    "id_blood" INTEGER NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id_stock")
);

-- CreateTable
CREATE TABLE "BloodOutput" (
    "id_output" SERIAL NOT NULL,
    "output_date" TIMESTAMP(3) NOT NULL,
    "qty" INTEGER NOT NULL,
    "reason" TEXT,
    "id_blood" INTEGER NOT NULL,

    CONSTRAINT "BloodOutput_pkey" PRIMARY KEY ("id_output")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id_campaign" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id_campaign")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id_notification" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "status_notification" "StatusNotification" NOT NULL DEFAULT 'not_read',
    "date_notification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_donor" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id_notification")
);

-- CreateIndex
CREATE UNIQUE INDEX "BloodGroup_type_blood_key" ON "BloodGroup"("type_blood");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_CIN_key" ON "Donor"("CIN");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_id_user_key" ON "Donor"("id_user");

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_id_blood_fkey" FOREIGN KEY ("id_blood") REFERENCES "BloodGroup"("id_blood") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_id_donor_fkey" FOREIGN KEY ("id_donor") REFERENCES "Donor"("id_donor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_id_donor_fkey" FOREIGN KEY ("id_donor") REFERENCES "Donor"("id_donor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_id_blood_fkey" FOREIGN KEY ("id_blood") REFERENCES "BloodGroup"("id_blood") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodOutput" ADD CONSTRAINT "BloodOutput_id_blood_fkey" FOREIGN KEY ("id_blood") REFERENCES "BloodGroup"("id_blood") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_id_donor_fkey" FOREIGN KEY ("id_donor") REFERENCES "Donor"("id_donor") ON DELETE RESTRICT ON UPDATE CASCADE;
