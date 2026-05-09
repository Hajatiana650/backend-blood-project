/*
  Warnings:

  - Changed the type of `result` on the `analyses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "resultType" AS ENUM ('valid', 'invalid');

-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "result",
ADD COLUMN     "result" "resultType" NOT NULL;
