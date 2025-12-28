import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateToken = (id: Types.ObjectId | string, role: string) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  const options = {
    expiresIn: Number(process.env.JWT_EXPIRY || "1d"),
  };
  return jwt.sign(
    { id: id.toString(), role }, 
    secret,                      
    options                      
  );
};