/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `EmailVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "EmailVerification_email_idx";

-- CreateTable
CREATE TABLE "PasswordResetAttempt" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PasswordResetAttempt_email_createdAt_idx" ON "PasswordResetAttempt"("email", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerification_email_key" ON "EmailVerification"("email");
