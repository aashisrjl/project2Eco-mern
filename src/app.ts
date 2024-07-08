import express,{Application,Request,Response} from 'express';// types of express which gives by @types/express package dev dependencies
const app:Application = express()
const port:number = 3000

import * as dotenv from 'dotenv'
dotenv.config()
import "./database/connection"


app.get("/",(req:Request,res:Response)=>{
    res.send("Hello World")
})

app.get("/about",(req:Request,res:Response)=>{
    res.send("This is about page")
})

app.get("/contact",(req:Request,res:Response)=>{
    res.send("This is contact page")
});

app.listen(port,()=>{
    console.log("Server is running on port: "+port)
})