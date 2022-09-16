import prisma from "../databases/postgres";
import {TeachersDb} from "../types/teacherTypes";

export async function getTeacherByName(name: string){
    const teacherData = await prisma.teacher.findFirst({where: {name}})
    return teacherData
}
