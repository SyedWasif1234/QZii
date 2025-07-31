import express from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { checkAdmin, checkFaculty } from '../middleware/admin&faculty.middleware.js';
import { addCategory, deleteCategory, getAllCategories, getCategoryById } from './category.controller.js';

const CategoryRouter = express.Router()

CategoryRouter.post("/add-category" , AuthMiddleware , checkFaculty , addCategory )
CategoryRouter.get("/all-categories",AuthMiddleware,getAllCategories)
CategoryRouter.get("/getCategoryById/:categoryId" , AuthMiddleware , getCategoryById)
CategoryRouter.delete("/delete-category/:categoryId" , AuthMiddleware , checkFaculty , deleteCategory)


export default CategoryRouter