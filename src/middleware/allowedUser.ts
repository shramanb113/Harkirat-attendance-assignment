import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../util/jwtHandling.ts"; 

export const allowedUser = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing or invalid format",
      });
    }

    try {

      const parts = authHeader.split(" ");
      const token = parts[1];

      if (!token) {
        return res.status(401).json({ success: false, message: "Token missing" });
      }

      const decoded = verifyToken(token); 

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: `User role '${decoded.role}' is not authorized to access this route.`,
        });
      }


      req.user = decoded;

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
  };
};