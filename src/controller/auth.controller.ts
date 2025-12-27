import type{ Request, Response } from 'express';
import { signupService } from '../service/auth.service.ts';
import { connectDB } from '../config/dbConfig.ts';
import UserModel from '../models/user.model.ts';

export const loginController = (req: Request, res: Response) => {
    // login controller logic here

};
export const signupController = async (req: Request, res: Response) => {
    await connectDB()
    // signup controller logic here
    const {name , email , password , role} = req.body;
    const userDeclared : boolean= await signupService(name,email,password,role)
    if(!userDeclared){
        res.status(400).json({'success':false , "error":"Email already exists"})
    }
    const person = await UserModel.findOne({email}).select('+_id')
    res.status(201).json({
        "success":true,
        "data":{
            "_id":person?._id,
            "name":name,
            "email":email,
            "role":role
        }
    })
};