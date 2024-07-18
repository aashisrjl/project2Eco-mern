import {Request,Response} from 'express';
import { AuthRequest } from "../middleware/AuthMiddleware";
import { KhaltiResponse, OrderData, OrderStatus, PaymentMethod, PaymentStatus, TransactionStatus, TransactionVerificationResponse } from '../types/orderTypes';
import Order from '../database/models/orderModel';
import Payment from '../database/models/paymentModel';
import OrderDetail from '../database/models/orderDetailModel';
import axios from 'axios';
import Product from '../database/models/productModel';

class OrderController{
    async createOrder(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id;
        const {phoneNumber,shippingAddress,totalAmount,paymentDetails,items}:OrderData = req.body;
        if(!phoneNumber || !shippingAddress || !totalAmount || 
            !paymentDetails || !paymentDetails.paymentMethod || items.length ==0){
                res.status(400).json({
                    message:"Please fill all the fields"
                });
                return;
        }
      
        const paymentData = await Payment.create({
            paymentMethod: paymentDetails.paymentMethod
        })
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId,
            paymentId:paymentData.id
        })

        let responseOrderData;
        for(var i=0; i<items.length;i++){
            responseOrderData = await OrderDetail.create({
            quantity: items[i].quantity,
            productId: items[i].productId,
            orderId: orderData.id
        })
    }
        if(paymentDetails.paymentMethod === PaymentMethod.Khalti ){
            //khalti integration
            const data ={
                return_url :"http://localhost:3000/success",
                cancel_url :"http://localhost:3000/cancel",
                purchase_order_id: orderData.id,
                amount:totalAmount * 100,
                website_url : "http://localhost:3000/",
                purchase_order_name: 'orderName_'+ orderData.id
            }
            const response = await axios.post("https://a.khalti.com/api/v2/epayment/initiate/",data,{
                headers:{
                    "Authorization": "Key dbae3da99710442a83d9068ff967b2ed"
                }
            })
            const KhaltiResponse:KhaltiResponse = response.data;
            paymentData.pidx = KhaltiResponse.pidx;
            paymentData.save();
            res.status(200).json({
                message: "order placed success",
                url: KhaltiResponse.payment_url
            })

        }else{
            res.status(200).json({
                message:"Order placed successfully"
            })
        }
    
        



    }
    async verifyTransaction(req:AuthRequest,res:Response):Promise<void>{
        const {pidx} = req.body
        const userId = req.user?.id
        if(!pidx){
            res.status(400).json({
                message: "pidx is required"
                })
                return
        }
        const response = await axios.post("https://a.khalti.com/api/v2/epayment/lookup/",{pidx},{
            headers:{
                "Authorization": " key dbae3da99710442a83d9068ff967b2ed"
            }
        })
        const data:TransactionVerificationResponse= response.data
        if(data.status ===TransactionStatus.Completed){
            await Payment.update({
                PaymentStatus:'paid'
            }, {
                where:{
                pidx
            }})
            res.status(200).json({
                message: "Payment verified successfully"
            })
            

        }else{
            res.status(400).json({
                message:"payment not verified"
            })
        }
    }
    //userSide
    async fetchMyOrders(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const orders = await Order.findAll({
            where:{
                userId
            },
            include:[
                {
                    model:Payment
                }
            ]
        })
        if(orders.length >0){
        res.status(200).json({
            message: "orders fetch successfully",
            orders
        })
    }else{
        res.status(400).json({
            message: "no orders found"
            })
    }
    }

    async fetchOrderDetails(req:AuthRequest,res:Response):Promise<void>{
        const userId= req.user?.id
        const orderId = req.params.orderId
        const order = await OrderDetail.findAll({
            where: {
                orderId
                },
                include:[
                    {
                        model:Product
                        }
                        ]
                        })
                        if(order.length>0){
                            res.status(200).json({
                                message: "order details fetch successfully",
                                data: order
                                })
                                }else{
                                    res.status(400).json({
                                        message: "no order found"
                                        })
                                        }

    }
    async cancelMyOrder(req:AuthRequest,res:Response):Promise<void>{
        const userId = req.user?.id
        const orderId = req.params.orderId
        const order:any = await Order.findAll({
            where: {
                id:orderId,
                userId
                }
            })
            if(order?.orderStatus === OrderStatus.Preparation || order?.orderStatus === OrderStatus.Ontheway){
                res.status(400).json({
                    message:"Order can't be cancelled"
                })
                return
            }else{
                await Order.update({orderStatus: OrderStatus.Cancelled},{
                    where:{
                        id:orderId 
                    }
                })
                res.status(200).json({
                    message:"Order cancelled successfully"
                    })
            }
           

    }

    //admin side
}


export default new OrderController();