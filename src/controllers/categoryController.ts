
import Category from '../database/models/categoryModel';
class CategoryController{
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
    async seedCategory():Promise<void>{
        const CategoryData = await Category.findAll();
        if(CategoryData.length ===0){
        const data = Category.bulkCreate(this.categoryData)
        console.log("category seeded");
        }else{
            console.log("category already seeded");
        }

    }
    
}
export default new CategoryController()