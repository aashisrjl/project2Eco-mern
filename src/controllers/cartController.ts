import {Request,Response} from 'express';
import Cart from '../database/models/cartModel';
import { AuthRequest } from '../middleware/AuthMiddleware';
import Product from '../database/models/productModel';

class cartController{
    // add to cart
    async addToCart(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id;
        const {quantity,productId} = req.body
        if(!productId || !quantity){
            res.status(403).json({
                message: "please Enter quantity and productId "
            })
            return;
        }
        // if(!userId){
        //     res.status(401).json({
        //         message:"user not found with this id"
        //     })
        //     return;
        // }
        let cartItem = await Cart.findOne({
            where:{
                userId,
                productId
            }
        })
        if(!cartItem){
         cartItem = await Cart.create({
            userId,
            quantity,
            productId
        })
        res.status(201).json({
            message:"added to cart  successfully",
            data: cartItem
        })
    }else{
        cartItem.quantity += quantity
        await cartItem.save();
    }
        

    }
    //get cart item
    async getCartItem(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id;
        const cartItems = await Cart.findAll({
            where:{
                userId
                },
                    include:[
                        {
                            model:Product
                        }
                    ]
                })
                res.status(200).json({
                    message:"cart items fetch successfully",
                    data:cartItems
                    })
                    if(cartItems.length === 0){
                        res.status(200).json({
                            message:"cart is empty"
                            })
                            return;
                    }
    }
}
export default new cartController();
