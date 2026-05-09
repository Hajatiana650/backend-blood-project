-- CreateEnum
CREATE TYPE "Role" AS ENUM ('labo', 'admin', 'donor');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('normal', 'low', 'urgence');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('send', 'not_read');

-- CreateTable
CREATE TABLE "users" (
    "id_user" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phone_number" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "donors" (
    "id_donor" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "photo" TEXT,
    "CIN" TEXT NOT NULL,
    "isApte" BOOLEAN NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_blood" INTEGER NOT NULL,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id_donor")
);

-- CreateTable
CREATE TABLE "analyses" (
    "id_analysis" SERIAL NOT NULL,
    "analysis_date" TIMESTAMP(3) NOT NULL,
    "result" TEXT NOT NULL,
    "attachement" TEXT,
    "observation" TEXT,
    "weight" DOUBLE PRECISION NOT NULL,
    "tension" TEXT NOT NULL,
    "id_donor" INTEGER NOT NULL,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id_analysis")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id_stock" SERIAL NOT NULL,
    "bags" INTEGER NOT NULL,
    "status_stock" "StockStatus" NOT NULL,
    "id_blood" INTEGER NOT NULL,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id_stock")
);

-- CreateTable
CREATE TABLE "donations" (
    "id_donation" SERIAL NOT NULL,
    "bags_qty" INTEGER NOT NULL,
    "donation_date" TIMESTAMP(3) NOT NULL,
    "id_donor" INTEGER NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id_donation")
);

-- CreateTable
CREATE TABLE "blood_outputs" (
    "id_output" SERIAL NOT NULL,
    "output_date" TIMESTAMP(3) NOT NULL,
    "qty" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "id_blood" INTEGER NOT NULL,

    CONSTRAINT "blood_outputs_pkey" PRIMARY KEY ("id_output")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id_campaign" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "place" TEXT NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id_campaign")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id_notification" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "status_notification" "NotificationStatus" NOT NULL,
    "date_notification" TIMESTAMP(3) NOT NULL,
    "id_donor" INTEGER NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id_notification")
);

-- CreateTable
CREATE TABLE "blood_groups" (
    "id_blood" SERIAL NOT NULL,
    "type_blood" TEXT NOT NULL,

    CONSTRAINT "blood_groups_pkey" PRIMARY KEY ("id_blood")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "donors_CIN_key" ON "donors"("CIN");

-- CreateIndex
CREATE UNIQUE INDEX "donors_id_user_key" ON "donors"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "blood_groups_type_blood_key" ON "blood_groups"("type_blood");

-- AddForeignKey
ALTER TABLE "donors" ADD CONSTRAINT "donors_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donors" ADD CONSTRAINT "donors_id_blood_fkey" FOREIGN KEY ("id_blood") REFERENCES "blood_groups"("id_blood") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_id_donor_fkey" FOREIGN KEY ("id_donor") REFERENCES "donors"("id_donor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_id_blood_fkey" FOREIGN KEY ("id_blood") REFERENCES "blood_groups"("id_blood") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_id_donor_fkey" FOREIGN KEY ("id_donor") REFERENCES "donors"("id_donor") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_outputs" ADD CONSTRAINT "blood_outputs_id_blood_fkey" FOREIGN KEY ("id_blood") REFERENCES "blood_groups"("id_blood") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_id_donor_fkey" FOREIGN KEY ("id_donor") REFERENCES "donors"("id_donor") ON DELETE CASCADE ON UPDATE CASCADE;
