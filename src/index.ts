import express, {json} from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors())
app.use(json())

app.get("/", (req,res)=> res.status(200).send("servidor no ar"))



const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server is up and running on port ${port}`)
});