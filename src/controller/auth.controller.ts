import type { Request, Response } from 'express';
import { loginService, signupService,getMeService } from '../service/auth.service.ts';
import { connectDB } from '../config/dbConfig.ts';
import UserModel from '../models/user.model.ts';

export const loginController = async (req: any, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await loginService(email, password);

    res.set('Authorization', `Bearer ${result.token}`);
    res.status(200).json({ success: true, data: { token: result.token } });

  } catch (error: any) {
    console.error(error.message);

    if (error.message === "User not found") {
      return res.status(404).json({ 
        success: false,
        message: "No account found with this email"
      });
    }

    if (error.message === "Incorrect password") {
      return res.status(401).json({ 
        success: false,
        message: "Incorrect password"
      });
    }

    res.status(500).json({ success: false, message: "Server Error" });
  }
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

export const getMeController = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await getMeService(userId); 

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};