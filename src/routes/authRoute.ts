import { Router } from "express";
import schemaMiddleware from "../middlewares/schemaMiddleware";


import {signUp, signIn} from "../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", schemaMiddleware, signUp)
authRouter.post("/signin", schemaMiddleware, signIn)

export default authRouter;