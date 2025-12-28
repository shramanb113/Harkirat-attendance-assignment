import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../util/jwtHandling.ts"; 

export const checkLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized, no token provided" 
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    if(!token) return res.status(401).json({"success":false,"message":"No token found"})

    const decoded = verifyToken(token); 

    

    next();

  } catch (error: any) {
    return res.status(401).json({ 
      success: false, 
      message: "Not logged in" 
    });
  }
};