-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_authorId_fkey`;

-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `Ticket` DROP FOREIGN KEY `Ticket_statusId_fkey`;

-- AlterTable
ALTER TABLE `Ticket` MODIFY `authorId` INTEGER NULL,
    MODIFY `projectId` INTEGER NULL,
    MODIFY `statusId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `Status`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
