import mongoose ,{model,type Model,type InferSchemaType} from "mongoose"
import { Types } from "mongoose"


const classSchema = new mongoose.Schema({
    className:{
        type:String,
        required:[true,'class name required']
    },
    teacherId:{
        type:Types.ObjectId,
        ref:'users',
        required:true
    },
    studentIds:{
        type:[Types.ObjectId],
        ref:'users'
    }
})

type Class = InferSchemaType<typeof classSchema>

const ClassModel:Model<Class> = (mongoose.models.class as Model<Class>) || model<Class>('class',classSchema)

export default ClassModel