import { Router } from "express";
import authRouter from "../routes/authRoute";

const router = Router();



router.use(authRouter);



export default router;