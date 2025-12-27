import mongoose,  { model,models,Model, type InferSchemaType } from 'mongoose'
import { USER_ROLES_ARRAY } from '../constants/userRoles.ts'


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide your name'],
        trim:true,
    },
    email:{
        type:String,
        required:[true,'email required'],
        unique:true,
        lowercase:true,
        trim:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ ,"please enter a valid email address"]
    },
    password:{
        type:String,
        required:[true,'Please provide us with a password'],
        select:false,
        match:[/^(?=(?:\D*\d){6}).*$/,"please enter a password"]
    },
    role:{
        type: String,
        enum: USER_ROLES_ARRAY
    }
})

type User = InferSchemaType<typeof userSchema>

const UserModel: Model<User> = (models.user as Model<User>) || model<User>('users',userSchema)

export default UserModel