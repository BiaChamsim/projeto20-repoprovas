import { Router } from "express";
import ValidatTokenMiddleware from "../middlewares/validateToken"
import validateSchema from "../middlewares/schemaMiddleware";
import postTestSchema from "../schemas/postTestSchema";
import { postTests, getTestsByDiscipline } from "../controllers/testController";


const testRouter = Router();

testRouter.post("/test", ValidatTokenMiddleware, validateSchema(postTestSchema), postTests)
testRouter.get("/test", ValidatTokenMiddleware, getTestsByDiscipline)

export default testRouter;