/*
  Warnings:

  - A unique constraint covering the columns `[title,quizId]` on the table `Question` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,categoryId]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- AlterTable
ALTER TABLE "UserQuestionAnswer" ADD COLUMN     "timeLimit" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Question_title_quizId_key" ON "Question"("title", "quizId");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_title_categoryId_key" ON "Quiz"("title", "categoryId");

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
