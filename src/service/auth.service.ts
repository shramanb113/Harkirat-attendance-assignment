import { connectDB } from "../config/dbConfig.ts";
import type { UserRoles } from "../constants/userRoles.ts";
import { comparePassword, hashPassword } from "../util/passwordHash.ts";
import UserModel from '../models/user.model.ts';
import type { Types } from "mongoose";
import { generateToken } from "../util/jwtHandling.ts";

export const loginService = async (email: string, password: string) => {
  await connectDB();
  const user = await UserModel.findOne({ email }).select('+password');

  if (!user) {
    throw new Error("User not found"); 
  }

  const isPasswordMatch = await comparePassword(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Incorrect password");
  }

  const token = generateToken(user._id, user.role);
  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};




export const signupService = async (
    name:string,
    email:string,
    password:string,
    role:UserRoles
) : Promise<boolean> => {
    await connectDB()

    const hashed = await hashPassword(password)
    const userinDB = await UserModel.findOne({email})

    if(userinDB) return false

    const user = {
        name:name,
        email:email,
        password: hashed,
        role : role
    }

    await UserModel.create(user)
    return true
};



export const getMeService = async (userId: string) => {
  const user = await UserModel.findById(userId).select('-password');
  return user;
};

