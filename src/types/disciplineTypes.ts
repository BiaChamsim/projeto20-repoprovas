import {Discipline} from "@prisma/client";

export type TestDiscipline = Omit<Discipline, "id">

