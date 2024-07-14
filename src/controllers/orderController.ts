import {Request,Response} from 'express';
import { AuthRequest } from "../middleware/AuthMiddleware";
import { OrderData, paymentMethod } from '../types/orderTypes';
import Order from '../database/models/orderModel';
import Payment from '../database/models/paymentModel';
import OrderDetail from '../database/models/orderDetailModel';
import axios from 'axios';

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
        const orderData = await Order.create({
            phoneNumber,
            shippingAddress,
            totalAmount,
            userId
        })

        const paymentData = await Payment.create({
            paymentMethod: paymentDetails.paymentMethod
        })

        for(let i=0; i<items.length;i++){
        await OrderDetail.create({
            quantity: items[i].quantity,
            productId: items[i].productId,
            orderId: orderData.id
        })
        if(paymentDetails.paymentMethod === paymentMethod.Khalti ){
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
            console.log(response)

        }else{
            res.status(200).json({
                message:"Order placed successfully"
            })
        }
    }
        



    }
}
export default new OrderController();