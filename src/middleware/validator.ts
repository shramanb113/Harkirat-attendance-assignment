import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';


export const validateRequest = (schema : z.Schema)=>{
    return (req: Request, res: Response, next: NextFunction) => {

        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                "success": false,
                "message": 'Invalid request schema',
            });
        }
        req.body = result.data;
        next();
    }
}