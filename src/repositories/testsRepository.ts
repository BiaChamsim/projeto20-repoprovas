import prisma from "../databases/postgres";
import {UserTest} from "../types/testType";

export async function getTestByName(name: string){
    const testData = await prisma.test.findFirst({where: {name}})
    return testData
}

export async function insert(newTest: UserTest) {
    await prisma.test.create({data: newTest})
}
