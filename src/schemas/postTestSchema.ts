import joi from "joi";

const postTestSchema = joi.object({
    name: joi.string().required(),
    pdfUrl: joi.string().uri().required(),
    category: joi.string().required(),
    subject: joi.string().required(),
    teacher: joi.string().required()
})

export default postTestSchema;