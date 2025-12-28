import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

interface TokenPayload {
  userId: string;
  role: string;
}

export const generateToken = (
  id: Types.ObjectId | string,
  role: string | null | undefined,
) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  const options = {
    expiresIn: Number(process.env.JWT_EXPIRY || '1d'),
  };
  return jwt.sign({ userId: id.toString(), role }, secret, options);
};

export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not defined');
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error: any) {
    if (error.name == 'TokenExpired') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid Token');
  }
};
