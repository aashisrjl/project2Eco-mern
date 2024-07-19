import express,{Application,Request,Response} from 'express';// types of express which gives by @types/express package dev dependencies
const app:Application = express()
const port:number = Number(process.env.SERVER_PORT) || 3000

app.use(express.urlencoded({extended:true}))
app.use(express.json())

import * as dotenv from 'dotenv'
dotenv.config()
import "./database/connection"

// import userRouter
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import categoryRoute from './routes/categoryRoute';
import cartRoute from './routes/cartRoute';
import orderRoute from './routes/orderRoute'
import adminSeeder from './adminSeeder';
import categoryController from './controllers/categoryController';
adminSeeder();
categoryController.seedCategory();

app.use("",userRoute)
app.use("/admin/product",productRoute)
app.use("/admin/category",categoryRoute)
app.use("/customer/cart",cartRoute)
app.use("/order",orderRoute)

app.listen(port,()=>{
    console.log("Server is running on port: "+port)
})