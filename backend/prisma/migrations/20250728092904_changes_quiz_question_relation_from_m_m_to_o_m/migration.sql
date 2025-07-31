/*
  Warnings:

  - You are about to drop the `_QuizQuestions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quizId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'FACULTY';

-- DropForeignKey
ALTER TABLE "_QuizQuestions" DROP CONSTRAINT "_QuizQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_QuizQuestions" DROP CONSTRAINT "_QuizQuestions_B_fkey";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "quizId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_QuizQuestions";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
