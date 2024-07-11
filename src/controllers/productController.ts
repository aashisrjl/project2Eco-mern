import { Request,Response } from "express";
import Product from "../database/models/productModel";
import { AuthRequest } from "../middleware/AuthMiddleware";
import User from "../database/models/userModel";
import Category from "../database/models/categoryModel";
class productController {
    async addProduct(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id;
        const {productName,productDescription,productPrice,productTotalStockQty,categoryId} = req.body;
        let fileName;
        console.log("file: "+ req.file)
        if(req.file){
           fileName = req.file.filename;
        }else{
            fileName = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnSEP-JmKoRlG1sputmEuDbWHcwW8iALV5eg&s";
        }
        if(!productName || !productDescription || !productPrice || !productTotalStockQty || !categoryId){
            res.status(400).json({
                message: "please Enter all details"
            })
            return;
        }else{
            await Product.create({
                productName,
                productDescription,
                productPrice,
                productTotalStockQty,
                productImageUrl:fileName,
                userId:userId,
                categoryId:categoryId
            })
        }
        res.status(200).json({
            message: "Product Added Successfully"
            })

    }

    async getAllProducts(req:AuthRequest,res:Response):Promise<void>{
        const  data = await Product.findAll({
                include:[
                    {
                    model: User,
                    attributes: ['id','email','username']
                    },
                    {
                        model: Category,
                        attributes:['id','categoryName']
                    }
                ]
        });
        if(!data){
            res.status(400).json({
                message: "No Products Found"
                })
                return;
        }else{
            res.status(200).json({
                message: "Products Found",
                data:data
                })
        }
    }

    async getSingleProduct(req:AuthRequest,res:Response):Promise<void>{
        const productId = req.params.id;
        const data = await Product.findOne({
                where:{
                    id:productId
                },
                include:[
                    {
                    model: User,
                    attributes:['id','email','username']
                    },{
                        model: Category,
                        attributes: ['id','categoryName']
                    }
                ]
        })
        if(!data){
            res.status(400).json({
                message: "Single Product Not Found"
                })
        }else{
            res.status(200).json({
                message: " Single Product Found",
                data:data
                })
        }
    }

}
export default new productController();