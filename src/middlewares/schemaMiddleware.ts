import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";


export default function validateSchema(schema: ObjectSchema){
    return (req: Request, res: Response, next: NextFunction) => {

        const {error} = schema.validate(req.body, {abortEarly: false})
    
        if(error){
            const errors: string[] = error.details.map(err => err.message ) 
            return res.status(422).send(errors)
        }
    
        next()

    }
}