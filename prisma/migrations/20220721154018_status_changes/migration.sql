/*
  Warnings:

  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_statusId_fkey`;

-- AlterTable
ALTER TABLE `Ticket` ADD COLUMN `status` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `Status`;
