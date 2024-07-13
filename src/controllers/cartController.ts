import {Request,Response} from 'express';
import Cart from '../database/models/cartModel';
import { AuthRequest } from '../middleware/AuthMiddleware';
import Product from '../database/models/productModel';
import Category from '../database/models/categoryModel';

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
                            model:Product,
                            include:[
                                {
                                    model: Category
                                }
                            ]
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
    // delete a cart
    async deleteCartItem(req:AuthRequest,res:Response):Promise<void>{
        const productId = req.params.id;
        const userId = req.user?.id;
        const data = Cart.findOne({where:{productId,userId}});
        if(!data){
            res.status(404).json({
                message:"this user have not cart items"
                })
        }else{
            await Cart.destroy({where:{productId,userId}})
            res.status(200).json({
                message:"cart item deleted successfully"
                })
        }
    }
    //update cartItem
    async updateCartItem(req:AuthRequest,res:Response):Promise<void>{
    const userId = req.user?.id;
    const {quantity} = req.body;
    const productId = req.params.id;
    const data = Cart.findOne({where:{productId,userId}});
    if(!data){
        res.status(404).json({
            message:"this user have not cart items"
            })
            }else{
                await Cart.update({quantity:quantity},{where:{productId,userId}})
                res.status(200).json({
                    message:"cart item updated successfully"
                    })
                    }

    }
}
export default new cartController();
