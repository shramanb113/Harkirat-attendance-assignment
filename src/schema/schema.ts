import { Types } from 'mongoose'
import {z} from 'zod'

export const loginSchema = z.object({
    email:z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password:z.string()

})

export type loginSchemaType = z.infer<typeof loginSchema>


export const signupSchema = z.object({
    name:z.string(),
    email:z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password:z.string().regex(/^(?=(?:\D*\d){6}).*$/),
    role:z.enum(['teacher','student'])
})

export type signupSchemaType = z.infer<typeof signupSchema>

export const classRouteSchema = z.object({
    className:z.string(),
})

export type classRouteSchemaType = z.infer<typeof classRouteSchema>


export const addStudentSchema = z.object({
    className:z.string(),
})
export type addStudentSchemaType = z.infer<typeof addStudentSchema>

export const getClassSchema = z.object({
    studentId:z.string(),
})
export type getClassSchemaType = z.infer<typeof getClassSchema>