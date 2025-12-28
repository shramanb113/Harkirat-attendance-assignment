import {Types,model,models,type Model,Schema,type InferSchemaType} from 'mongoose'
import { required } from 'zod/mini'
import { AttENDANCE_STATUS, AttENDANCE_STATUS_VALUES } from '../constants/attendanceStatus.ts'

const attendanceSchema = new Schema({
    classId:{
        type:Types.ObjectId,
        required:true
    },
    studentId:{
        tyoe:Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:AttENDANCE_STATUS_VALUES

    }

})

type Attendance= InferSchemaType<typeof attendanceSchema>

const AttendanceModel:Model<Attendance> =(models.attendance as Model<Attendance>) || model<Attendance>('attendance',attendanceSchema)
export default AttendanceModel 