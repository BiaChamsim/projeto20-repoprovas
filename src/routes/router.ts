import { Router } from "express";
import authRouter from "../routes/authRoute";
import testRouter from "./testRouter";

const router = Router();



router.use(authRouter);
router.use(testRouter);



export default router;