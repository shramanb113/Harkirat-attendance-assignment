import type { Request, Response } from 'express';
import { loginService, signupService } from '../service/auth.service.ts';
import { connectDB } from '../config/dbConfig.ts';
import UserModel from '../models/user.model.ts';
import jwt from 'jsonwebtoken';

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

export const getMeController = async (req: Request, res: Response) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing"
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not defined");

    const decoded = jwt.verify(token, secret) as { userId: string; role: string };


    const user = await UserModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
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
    console.error("Auth Error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    res.status(500).json({ success: false, message: "Server Error" });
  }
};
