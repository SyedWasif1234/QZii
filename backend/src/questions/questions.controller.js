import { Prisma } from "../generated/prisma/index.js";
import { db } from "../lib/db.js"; 


/* ADDIGN MULTIPLE QUESTIONS IN A SINGLE API CALL
EXAMPLE:-
{
  "questions": [
    {
      "title": "What is 2 + 2?",
      "marks": 5,
      "timeLimit": 30,
      "options": [
        { "text": "3", "isCorrect": false },
        { "text": "4", "isCorrect": true },
        { "text": "5", "isCorrect": false },
        { "text": "6", "isCorrect": false }
      ]
    },
    {
      "title": "Capital of France?",
      "marks": 5,
      "timeLimit": 30,
      "options": [
        { "text": "Berlin", "isCorrect": false },
        { "text": "Paris", "isCorrect": true },
        { "text": "Madrid", "isCorrect": false },
        { "text": "Rome", "isCorrect": false }
      ]
    }
  ]
}


*/
export const addQuestions = async (req, res) => {
  try {
    const { categoryId, quizId } = req.params;
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions must be a non-empty array" });
    }

    let totalNewMarks = 0;
    const createdQuestions = [];

    for (const q of questions) {
      const { title, marks, timeLimit, options } = q;

      if (!title || !marks || !timeLimit || !Array.isArray(options)) {
        return res.status(400).json({ message: "Each question must have title, marks, timeLimit and options array" });
      }

      const correctCount = options.filter(o => o.isCorrect).length;
      if (correctCount !== 1) {
        return res.status(400).json({ message: `Each question must have exactly one correct option (error in question: ${title})` });
      }

     

      const newQuestion = await db.Question.create({
        data: {
          title,
          marks,
          timeLimit,
          categoryId,
          quizId,
          options: { create: options }
        },
        include: { options: true }
      });

      totalNewMarks += marks;
      createdQuestions.push(newQuestion);
    }

    // Update quiz total marks once after all questions are added
    await db.Quiz.update({
      where: { id: quizId },
      data: {
        Totalmarks: {
          increment: totalNewMarks
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Questions added successfully",
      questions: createdQuestions
    });

  } catch (error) {
    console.error("Error adding multiple questions:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding multiple questions",
      error
    });
  }
};


//get all questions of particular quiz belong to particular category
export const getallQuestions = async(req,res) =>{
    try {

        const { quizId} = req.params;
        const allQuestions = await db.Question.findMany({
            where:{
                quizId:quizId
            },
            include:{
                options:true
            }  
        })

        return res.status(200).json({
            message:"fetched all questions of particular quiz belong to particular category ",
            questions:allQuestions
        })
        
    } catch (error) {
        console.log("error occured while fetching all the question:",error);
        res.status(500).json({message:"error occured while fetching all the questions", error})
    }
}

//now if user start solving the quiz if he tck the corect answe then given marks of the question wil be added else not

export const updateQuestions = async(req,res) =>{
    try {
        
    } catch (error) {
        console.log("error occured while updating  questions", error);
        res.status(500).json({
            success:false,
            message:"error occured while updating  questions",
            error
        })
    }
}



//feature to add in future: how musch time user took to answer will also be saved
export const submitAnswer = async (req, res) => {
  try {

    const userId = req.user.id;
    const{quizId} = req.params;
    const{answers} = req.body; //Array of the answer from the frontend
    /*  

    DUMMY DATA OF HOW MY ANSWER ARRAY WILL LOOK LIKE

    
    answers: [
      {
        "questionId": "clwjkc6570002asdfg1h23456",
        "selectedOptionId": "clwjkc65e000basdfghjk7890"
      },
      {
        "questionId": "clwjkd1230004qwertyui1234",
        "selectedOptionId": "clwjkd12z000qwertyuizx567"
      },
      {
        "questionId": "clwjkf9870008poilkjmnb0987",
        "selectedOptionId": null
      }
    ]
  
    
    */

    if(!Array.isArray(answers))  return res.status(400).json({ message: "Answers must be an array." });

    const result = await db.$transaction(async(prisma)=>{
      //create a new array carring all questions id
      const questionId = answers.map((a)=>a.questionId); 

      //fetch all the correct options for these questions 
      const correctOptions = await prisma.Option.findMany({
        where:{
          questionId:{in:questionId},
          isCorrect:true
        },
        select:{
          id:true,
          questionId:true,
          question:{select:{marks:true}}
        }
      });

      const correctOptionMap = new Map();
      correctOptions.forEach((opt)=>{
        correctOptionMap.set(opt.questionId , {
          correctOptionId:opt.id,
          marks:opt.question.marks
        });
      });
     
      let totalScore =0;
      for (const answer of answers) {
        const correctInfo = correctOptionMap.get(answer.questionId);
        if (correctInfo && answer.selectedOptionId === correctInfo.correctOptionId) {
          totalScore += correctInfo.marks;
        }
      }

      //create a final quiz attempt record
      const quizAttempt = await prisma.UserQuizAttempt.create({
        data:{
          userId:userId,
          quizId:quizId,
          score:totalScore,
        }
      })


      return { score: quizAttempt.score };
    })
    res.status(200).json({
      success: true,
      message: "Quiz submitted successfully!",
      finalScore: result.score,
    });
  } catch (error) {
    console.error("Submit error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};






export const deleteQuestions = async(req,res) =>{
    try {
        const{questionId} = req.params;

        const question = await db.Question.findUnique({where:{id:questionId}})
        if(!question) return res.status(400).json({message:"no such question exists"});

        await db.Question.delete({where:{id:questionId}})

        res.status(200).json({
            success:true,
            message:"question deleted successfully"
        })
        
    } catch (error) {
        console.log("error occured while deleting a questions", error);
        res.status(500).json({
            success:false,
            message:"error occured while deleting    a questions",
            error
        })
    }
}
