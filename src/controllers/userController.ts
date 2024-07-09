import {Request,Response} from 'express';
import User from '../database/models/userModel';
// to hash the password
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


class AuthController{
   public static async registerUser(req:Request,res:Response):Promise<void>{
    // try{
        const {username,role,email,password} = req.body;
        if(!username || !email || !password){
            res.status(400).json({
                message:"please provide username, email and password"
            });
            return;
        }
           const user = await User.create({
                username,
                role,
                email,
                password:String(bcrypt.hashSync(password,10))
            })
            
                res.status(201).json({
                    message:"user created successfully",
                    user: user
                });
            // }catch(err){
            //     res.status(500).json({
            //         message: `server error,${err}`
            //     })
            // }
    }
// login code 
    public static async loginUser(req:Request,res:Response):Promise<void>{
        // try{
        const {email,password} = req.body;
        if(!email || !password){
            res.status(400).json({
                message: "please enter email and password first"
            })
            return;
        }
        const user = await User.findOne({where:{email}});
        // check if the email is already registered
        if(!user){
            res.status(400).json({
                message: "please register first"
            })
            return;
        }
        const isMatch = await bcrypt.compareSync(password,user.password);
        if(!isMatch){
            res.status(400).json({
                message:"password incorrect"
            })
            return;
        }
        // jwt token store in cookies in ts

        const token = jwt.sign({id:user.id},process.env.JWT_SECRET as string,{
            expiresIn:process.env.JWT_EXPIRE
        })
        res.cookie("jwtToken",token);

        res.status(200).json({
            message: "Login success",
            user: user.username,
            role: user.role,
            token: token
        })

        // }catch(err){
        //     res.status(500).json({
        //         error: `server error: ${err}`
        //     })
        // }
    }
}
export default AuthController;
