import { Request,Response } from "express";
import Product from "../database/models/productModel";
class productController {
    async addProduct(req:Request,res:Response):Promise<void>{
        const {productName,productDescription,productPrice,productTotalStockQty} = req.body;
        let fileName;
        if(req.file){
           fileName = req.file.filename;
        }else{
            fileName = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnSEP-JmKoRlG1sputmEuDbWHcwW8iALV5eg&s";
        }
        if(!productName || !productDescription || !productPrice || !productTotalStockQty){
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
                productImageUrl:fileName
            })
        }
        res.status(200).json({
            message: "Product Added Successfully"
            })

    }

}
export default new productController();