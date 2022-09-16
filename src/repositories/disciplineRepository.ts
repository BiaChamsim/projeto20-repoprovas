import prisma from "../databases/postgres";
import {TestDiscipline} from "../types/disciplineTypes";

export async function getDisciplineByName(name: string){
    const disciplineData = await prisma.discipline.findFirst({where: {name}})
    return disciplineData
}

