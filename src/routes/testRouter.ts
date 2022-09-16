import { Router } from "express";
import ValidatTokenMiddleware from "../middlewares/validateToken"
import { postTests } from "../controllers/testController";


const testRouter = Router();

testRouter.post("/test", ValidatTokenMiddleware, postTests)
//testRouter.post("/test")

export default testRouter;