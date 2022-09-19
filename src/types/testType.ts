import {Test} from "@prisma/client";

export type UserTest = Omit<Test, "id">

export interface TestByDiscipline{
    number: number;
    disciplines:{
        name: string;
        TeachersDisciplines?: any;
        categories?: any
    }[]
}

export interface TestByTeacher {
    name: string;
    TeachersDisciplines?: any;
    categories?: any;
  };

