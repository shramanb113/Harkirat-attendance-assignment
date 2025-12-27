import { connectDB } from "../config/dbConfig.ts";
import type { UserRoles } from "../constants/userRoles.ts";
import { hashPassword } from "../util/passwordHash.ts";
import UserModel from '../models/user.model.ts';

export const loginService = () => {
    // login service logic here
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