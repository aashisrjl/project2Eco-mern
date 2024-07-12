import { Request,Response } from 'express';
import Category from '../database/models/categoryModel';
class CategoryController{
    // already define the category
    categoryData = [
        {
            categoryName: "Electronics"
        },
        {
            categoryName: "Groceries"
        },
        {
            categoryName: "Food"
        }
    ]
    //category seeding
    async seedCategory():Promise<void>{
        const CategoryData = await Category.findAll();
        if(CategoryData.length ===0){
        const data = Category.bulkCreate(this.categoryData)
        console.log("category seeded");
        }else{
            console.log("category already seeded");
        }

    }
    //add category
    async addCategory(req:Request,res:Response):Promise<void>{
        const {categoryName} = req.body;
        if(!categoryName){
            res.status(403).json({
                message:"Enter category name first"
            })
            return;
        }
        const data = await Category.create({
            categoryName
        })
        res.status(200).json({
            message:"Category added successfully",
            data
            })
    }
    //get all category
    async getCategory(req:Request,res:Response):Promise<void>{
        const data = await Category.findAll();
        res.status(200).json({
            message:"Category fetched successfully",
            data
            })
    }
    //delete category
    async deleteCategory(req:Request,res:Response):Promise<void>{
        const {id} = req.params;
        const data = await Category.findOne({where: {id:id}});
        if(data){
        await Category.destroy({
            where:{id}
        })
        res.status(200).json({
            message:"Category deleted successfully",
            data
            })
        }else{
            res.status(403).json({
                message:"Category not found"
                })
        }
    }
    //update category
    async updateCategory(req:Request,res:Response):Promise<void>{
        const {id} = req.params;
        const {categoryName} = req.body;
        const data = await Category.findOne({where:{id:id}});
      if(!data){
        res.status(403).json({
            message:"Category not found"
            })
      }else{
       const newData= await Category.update({categoryName},{where:{id:id}});
        res.status(200).json({
            message:"Category updated successfully",
            data:newData
            })

      }

    }
    
}
export default new CategoryController()