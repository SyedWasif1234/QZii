import { db } from "../lib/db.js";

export const addQuiz = async(req,res) =>{
    try {
        const userId = req.user.id;
        const {categoryId} = req.params;
        const {title} = req.body ;
    
        if(!categoryId) return res.status(400).json({message:"category is reqiured"});
    
       //finding existing quiz
    
        const addQuiz = await db.Quiz.create({
            data:{
                title,
                userId:userId,
                categoryId:categoryId
            }
        })
    
        res.status(200).json({
            success:true,
            message:"quize added successfully",
            quiz:addQuiz
        })
    } catch (error) {
         console.log("error occured while adding quiz  : " , error)
        
        res.status(500).json({
            error:"Error adding quiz "
        })
    }
}

//get all quizes irrespective of categories
export const getAllQuizes_without_category = async(req , res) =>{
  try {

    const allQuizes = await db.Quiz.findMany({
        include:{
            questions:true
        }
    })

    res.status(200).json({
        message:"all quiz fetched successfully",
        Quiz:allQuizes
    })
    
  } catch (error) {
    console.log("error occured while fetching all the quizes :" , error);
    res.status(500).json({message:"error occured while fetching all the quizes"})
  }
}

//fetching all quizes related to categories
export const getAllQuizes = async(req,res)=>{
    try {
        const{categoryId} = req.params;
        if(!categoryId) return res.status(400).json({message:"category id is missing"});

        const allQuizes = await db.Quiz.findMany({
            where:{
                categoryId:categoryId
            },
            include:{
                questions:true
            }
        })

        res.status(200).json({
            message:"all quiz fetched successfully",
            Quiz:allQuizes
        })

    } catch (error) {
        console.log("error occured while fetching all quizes");
        res.status(500).json({message:"error occured while fetching all quizes",error})
    }
}

export const getQuizById = async(req,res)=>{
  try {
    const{userId} = req.user.id;
    const{quizId} = req.params;
    const quiz = await db.Quiz.findUnique({
      where:{
        id:quizId
      }
    })
    res.status(200).json({
      success:true,
      quiz:quiz,
      message:"fetched successfully"
    })
  } catch (error) {
    console.log("error occured while fetching the quiz ");
    res.status(500).json({message:"error occcured while fetching quiz"})
  }
}

export const updateQuiz = async(req , res) =>{

}

export const deleteQuiz = async(req , res) =>{
       try {

        const{quizId} = req.params;
        if(!quizId) return res.status(400).json({message:"quiz id is required"});

        const quiz = await db.Quiz.findUnique({
            where:{
                id:quizId
            }
        })

        if(!quiz) return res.status(400).json({message:"no such quiz of the given id exists"});

        await db.Quiz.delete({
            where:{
                id:quizId
            }
        })

          res.status(200).json({
            success:true,
            message:"quiz deleted successfully"
        })
        
    } catch (error) {
        console.log("error occured while deleting a quiz", error);
        res.status(500).json({
            success:false,
            message:"Error occured while deleting a quiz",
            error
        })
    }
}



export const finishQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const{quizId} = req.params;
    //const { totalScore, timeTaken } = req.body;

    //
    const answers = await db.UserQuestionAnswer.findMany({
      where:{
        userId:userId,
        quizId:quizId
      }
    });

   

    const attempt = await db.UserQuizAttempt.create({
      data: {
        userId,
        quizId,
        score: totalScore,
        timeTaken,
      }
    });

    res.status(200).json({
      success: true,
      message: "Quiz attempt recorded",
      attempt,
    });
  } catch (error) {
    console.error("Finish error:", error);
    res.status(500).json({ success: false, message: "Error saving result" });
  }
};

//this will give data of  quiz  attended by the user
export const getUserScoreForQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId } = req.params;

    //all the answer of the questions in a quiz 
    const answers = await db.UserQuestionAnswer.findMany({
      where: {
        userId,
        quizId
      },
      select: {
        earnedMarks: true
      }
    });

    //calculate the total score 
    const totalScore = answers.reduce((sum, ans) => sum + ans.earnedMarks, 0);

    //update the total score user scored
    const attempt = await db.UserQuizAttempt.create({
      data:{
        score:totalScore,
        userId:userId,
        quizId:quizId
      }
    })

    res.status(200).json({
      success: true,
      totalScore,
      message: "Total marks fetched successfully",
      attempted:attempt
    });
  } catch (error) {
    console.error("Error fetching score:", error);
    res.status(500).json({
      success: false,
      message: "Error calculating total marks",
    });
  }
};
    