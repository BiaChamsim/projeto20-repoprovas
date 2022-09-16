import prisma from "../databases/postgres";
import {TeachersDisciplinesType} from "../types/teachersDiscipline";

export async function getTeachersDisciplinesById(teacherId: number, disciplineId: number){
    const teachersDisciplinesData = await prisma.teachersDisciplines.findFirst({where: {teacherId, disciplineId}})
    return teachersDisciplinesData
}

export async function insert(newTeachersDiscipline: TeachersDisciplinesType) {
    await prisma.teachersDisciplines.create({data: newTeachersDiscipline})
}