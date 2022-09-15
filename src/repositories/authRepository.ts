import prisma from "../databases/postgres";
import {UserAuth} from "../types/authTypes";


export async function getUserByEmail(email: string){
    const userData = await prisma.user.findUnique({where: {email: email}})
    return userData
}

export async function insert(newUser: UserAuth) {
    await prisma.user.create({data: newUser})
}