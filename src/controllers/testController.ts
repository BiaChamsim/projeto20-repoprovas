import {Request, Response} from "express";
import * as testService from "../services/testService";

export async function postTests(req: Request, res: Response){
    try{
        const {name, pdfUrl, category, subject, teacher} = req.body;
        //const userId = res.locals.userId.userId

        await testService.postTests(name, pdfUrl, category, subject, teacher)

        res.status(201).send();

    }catch(error: any){
        console.log(error)
        if(error.code === "not found"){
            return res.status(404).send(error.message)
        }else if(error.code === "conflict"){
            return res.status(409).send(error.message)
        }

        res.sendStatus(500);
    }
}

export async function getTestsByDiscipline(req: Request, res: Response){
    try{
        const tests = await testService.getTestsCategory();
        res.send(tests)

    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
} 

export async function getTestsGroupByTeacher(req: Request, res: Response) {
    const tests = await testService.getTestsTeacher();
  
    res.status(200).send(tests);
  }
