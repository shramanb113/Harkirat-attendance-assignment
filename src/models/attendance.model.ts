import mongoose , {Types,model,type Model,Schema,type InferSchemaType} from 'mongoose'
import {  ATTENDANCE_STATUS_VALUES } from '../constants/attendanceStatus.ts'

const attendanceSchema = new Schema({
    classId:{
        type:Types.ObjectId,
        ref:'class',
        required:true
    },
    studentId:{
        type:Types.ObjectId,
        ref:'users',
        required:true
    },
    status:{
        type:String,
        enum:ATTENDANCE_STATUS_VALUES

    }

})

type Attendance= InferSchemaType<typeof attendanceSchema>

const AttendanceModel:Model<Attendance> =(mongoose.models.attendance as Model<Attendance>) || model<Attendance>('attendance',attendanceSchema)
export default AttendanceModel 