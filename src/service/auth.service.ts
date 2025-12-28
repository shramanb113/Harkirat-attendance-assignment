import { connectDB } from "../config/dbConfig.ts";
import type { UserRoles } from "../constants/userRoles.ts";
import { comparePassword, hashPassword } from "../util/passwordHash.ts";
import UserModel from '../models/user.model.ts';
import type { Types } from "mongoose";
import { generateToken } from "../util/jwtHandling.ts";

export const loginService = async (
    email:string,
    password:string
) => {
    // login service logic here
    await connectDB()
    // We NEED the password here to compare it
    const user = await UserModel.findOne({ email }).select('+password'); 
    if(!user) return 1
    const isPasswordMatch = await comparePassword(password,user.password)
    if(!isPasswordMatch){ return 2}

    const token =  genrateToken(user._id,user.role)
    return token
};




export const signupService = async (
    name:string,
    email:string,
    password:string,
    role:UserRoles
) : Promise<boolean> => {
    // signup service logic here
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

function genrateToken(_id: Types.ObjectId, role: string | null | undefined) {
    throw new Error("Function not implemented.");
}
