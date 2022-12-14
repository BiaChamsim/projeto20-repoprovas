import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/router";

dotenv.config();

const app = express();
app.use(cors())
app.use(json())

app.use(router);



export default app; 
