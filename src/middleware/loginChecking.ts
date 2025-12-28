import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../util/jwtHandling.ts";


declare module "express" {
  export interface Request {
    user?: {
      userId: string;
      role: string;
    };
  }
}

export const checkLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized, no token provided" 
    });
  }

  try {

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token format" 
      });
    }

    const token = parts[1]; 
    if(!token) return res.status(401).json({success:false,message:'no token found'})

    const decoded = verifyToken(token); 

    req.user = decoded;

    next();

  } catch (error: any) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized, token failed" 
    });
  }
};