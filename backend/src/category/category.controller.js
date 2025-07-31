import {db} from "../lib/db.js";

//create category ->admin only
//delete category ->admin only
//update category

export const addCategory = async(req,  res) =>{
    try {
        const userId = req.user.id;
        const{name , description   } = req.body ;
        if(!name || !description) return res.status(400).json({message:"name and description are required fields"});

       //here facing problem in finding existinf catgory

        const category = await db.Category.create({
           data:{
             name,
             description,
             userId
            }
        })

        res.status(200).json({
            success:true,
            message:"category added succesfully",
            category:category
        })
        
    } catch (error) {
        console.log("error occured while adding category", error);
        res.status(500).json({
            success:false,
            message:"Error occured while adding a category",
            error
        })
    }
}

export const getAllCategories = async(req,res)=>{
    try {

        const allCategories = await db.Category.findMany({
            include:{
                quizzes:true
            }
        })

        res.status(200).json({
            message:"all category fetched successfully",
            categories:allCategories
        })
        
    } catch (error) {
        console.log("error occured while fetching all category", error);
        res.status(500).json({
            success:false,
            message:"Error occured while fetching all category",
            error
        })
    }
}

export const getCategoryById = async(req,res)=>{
    try {
        const{categoryId} = req.params;
        if(!categoryId) return res.status(400).json("no category found");

        const category = await db.Category.findUnique({
            where:{
                id:categoryId
            },
            include:{
                quizzes:true
            }
        });

        console.log(category)

        res.status(200).json({
            success:true,
            category:category,
            message:"category fetched successfully"
        })
    } catch (error) {
        console.log("error occured while fetching category by their id",error)
    }
}

export const updateCAtegory = async(req,  res) =>{
    try {
        
    } catch (error) {
        console.log("error occured while updating category", error);
        res.status(500).json({
            success:false,
            message:"Error occured while updating a category",
            error
        })
    }
}

export const deleteCategory = async(req,  res) =>{
    try {

        const{categoryId} = req.params;
        if(!categoryId) return res.status(400).json({message:"category id is required"});

        const category = await db.Category.findUnique({
            where:{
                id:categoryId
            }
        })

        if(!category) return res.status(400).json({message:"no such category of the given id exists"});

        await db.Category.delete({
            where:{
                id:categoryId
            }
        })

          res.status(200).json({
            success:true,
            message:"category deleted successfully"
        })
        
    } catch (error) {
        console.log("error occured while deleting a category", error);
        res.status(500).json({
            success:false,
            message:"Error occured while deleting a category",
            error
        })
    }
}