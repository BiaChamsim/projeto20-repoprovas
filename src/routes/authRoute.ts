import { Router } from "express";
import validateSchema from "../middlewares/schemaMiddleware";
import signUpSchema from "../schemas/signUpSchema";
import signInSchema from "../schemas/signInSchema";


import {signUp, signIn} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", validateSchema(signUpSchema), signUp)
authRouter.post("/signin", validateSchema(signInSchema), signIn)

export default authRouter;