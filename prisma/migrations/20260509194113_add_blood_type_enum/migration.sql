/*
  Warnings:

  - Changed the type of `type_blood` on the `blood_groups` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "BloodType" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'AB_POS', 'AB_NEG', 'O_POS', 'O_NEG');

-- AlterTable
ALTER TABLE "blood_groups" DROP COLUMN "type_blood",
ADD COLUMN     "type_blood" "BloodType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "blood_groups_type_blood_key" ON "blood_groups"("type_blood");
