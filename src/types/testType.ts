import {Test} from "@prisma/client";

export type UserTest = Omit<Test, "id">

export interface TestByDiscipline{
    number: number;
    disciplines:{
        name: string;
        TeachersDisciplines?: {
            Test:{
                categories:{
                    name:string,
                    Test: Test[]
                }
            }[]
        }[],
        categories?: any
    }[]
}

export interface TestByTeacher {
    name: string;
    TeachersDisciplines?: any;
    categories?: any;
  };

