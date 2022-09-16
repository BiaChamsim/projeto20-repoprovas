import {Teacher} from "@prisma/client";

export type TeachersDb = Omit<Teacher, "id">

