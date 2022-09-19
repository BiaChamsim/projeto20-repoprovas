import joi from "joi";

const signUpSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(10).required(),
    passwordConfirmation: joi.ref("password")
})

export default signUpSchema;