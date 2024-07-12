import { Request,Response } from "express";
import Product from "../database/models/productModel";
import { AuthRequest } from "../middleware/AuthMiddleware";
import User from "../database/models/userModel";
import Category from "../database/models/categoryModel";
import fs from 'fs';
class productController {
    //add
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
    //get all products
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
    //get product by id
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
            res.status(404).json({
                message: "Single Product Not Found"
                })
        }else{
            res.status(200).json({
                message: " Single Product Found",
                data:data
                })
        }
    }
    //delete product
    async deleteProduct(req:AuthRequest,res:Response):Promise<void>{
        const productId = req.params.id;
        const data = await Product.findOne({
            where:{id:productId}
        })
        const imageUrl = data?.productImageUrl;
        console.log(imageUrl)

        fs.unlink(`./src/uploads/${imageUrl}`,(err:any)=>{
            if(err){
                console.log(err)
                }else{
                    console.log("Image Deleted")
                    }
        })

        if(!data){
            res.status(404).json({
                message: "Product Not Found"
                })
        }else{
            await Product.destroy ({
                where:{id:productId}
            })
            res.status(200).json({
                message: "Product Deleted"
                })
                
            }

        }
    // update product with updating image from upload file also
    async productUpdate(req:AuthRequest,res:Response):Promise<void>{
            const productId = req.params.id;
            const {productName,productDescription,productPrice,productTotalStockQty} = req.body;
            let fileName;
            const oldData = await Product.findOne({
                where:{id:productId}
                })
                if(!oldData){
                    res.status(404).json({
                        message: "Product Not Found"
                        })
                }
                
                // delete old image
                if(req.file){
                const imageUrl= oldData?.productImageUrl;
                fs.unlink(`./src/uploads/${imageUrl}`,(err:any)=>{
                    if(err){
                        console.log(err)
                        }else{
                            console.log("Image Deleted")
                            }
                            })
                            fileName = req.file?.filename;
                        }
                        
                            // update product by id
                            const product = await Product.update({
                                productName,
                                productDescription,
                                productPrice,
                                productTotalStockQty,
                                productImageUrl: fileName
                                },{
                                    where:{id:productId}
                                    })
                                    res.status(200).json({
                                        message: "Product Updated"
                                        })
                                        
    }
        
        
    }

export default new productController();