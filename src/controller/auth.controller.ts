import type { Request, Response } from 'express';
import { loginService, signupService } from '../service/auth.service.ts';
import { connectDB } from '../config/dbConfig.ts';
import UserModel from '../models/user.model.ts';

export const loginController = async (req: Request, res: Response) => {
  // login controller logic here
    const {email,password} = req.body
    const data = await loginService(email,password)
    if(data==1){
        return res.status(404).json({"success":false,"message":"user not found"})
    }
    else if (data==2){
        return res.status(400).json({"success":false,"message":"invalid email or password"})
    }
    res.set('Authorization',`Bearer ${data}`)
    return res.status(200).json({
        "success":true,
        "data":{
            "token":data
        }
    })
};
export const signupController = async (req: Request, res: Response) => {
  try {
    await connectDB();
    // signup controller logic here
    const { name, email, password, role } = req.body;
    const userDeclared: boolean = await signupService(
      name,
      email,
      password,
      role,
    );
    if (!userDeclared) {
      res.status(400).json({ success: false, error: 'Email already exists' });
    }
    const person = await UserModel.findOne({ email }).select('+_id');
    res.status(201).json({
      success: true,
      data: {
        _id: person?._id,
        name: name,
        email: email,
        role: role,
      },
    });
  } catch (error) {
    return res.status(500).json({"success":false,"message":error});
  }
};
