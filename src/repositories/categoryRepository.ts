import prisma from "../databases/postgres";
import {TestCategory} from "../types/categoryTypes";

export async function getCategoryByName(name: string){
    const categoryData = await prisma.category.findFirst({where: {name}})
    return categoryData
}

