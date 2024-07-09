import {Request,Response} from 'express';
import User from '../database/models/userModel';
// to hash the password
const bcrypt = require('bcrypt');


class AuthController{
   public static async registerUser(req:Request,res:Response):Promise<void>{
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            res.status(400).json({
                message:"please provide username, email and password"
            });
            return;
        }
           const user = await User.create({
                username,
                email,
                password:String(bcrypt.hashSync(password,10))
            })
            
                res.status(201).json({
                    message:"user created successfully",
                    user: user
                });

    }
}
export default AuthController;
