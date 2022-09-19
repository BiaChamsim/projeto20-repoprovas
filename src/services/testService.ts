import { Discipline, TeachersDisciplines } from "@prisma/client";
import * as categoryRepository from "../repositories/categoryRepository";
import * as disciplineRepository from "../repositories/disciplineRepository";
import * as teacherRepository from "../repositories/teacherRepository";
import * as teachersDischiplinesRepository from "../repositories/teachersDisciplineRepository";
import * as testsRepository from "../repositories/testsRepository";
import {TestByDiscipline, TestByTeacher} from "../types/testType";


export async function postTests(name: string, pdfUrl:string, category: string, subject: string, teacher: string){
    const categoryData = await checkCategoryRegister(category)
    const disciplineData = await checkDisciplineRegister(subject) //id da disciplina atraves da disciplineData.id
    const teacherData = await checkTeacherRegister(teacher) //id do teacher atraves da teacherData.id    
    const teachersDisciplineData = await getTeachersDisciplineId(teacherData.id, disciplineData.id)
    await checkTestName(name)

    const formatTestsData = {name, pdfUrl, categoryId: categoryData.id, teacherDisciplineId: teachersDisciplineData.id}
    await testsRepository.insert(formatTestsData)
}

async function checkCategoryRegister(category: string){
    const categoryData = await categoryRepository.getCategoryByName(category)

    if(!categoryData){
        throw{
            code: "not found",
            message: "This category does not exists"
        }
    }

    return categoryData
}

async function checkDisciplineRegister(subject: string){
    const disciplineData = await disciplineRepository.getDisciplineByName(subject)

    if(!disciplineData){
        throw{
            code: "not found",
            message: "This discipline does not exists"
        }
    }

    return disciplineData
}

async function checkTeacherRegister(teacher: string){
    const teacherData = await teacherRepository.getTeacherByName(teacher)

    if(!teacherData){
        throw{
            code: "not found",
            message: "This teacher's name does not exists"
        }
    }

    return teacherData
}

async function getTeachersDisciplineId(teacherId: number, disciplineId: number){
    const teachersDisciplineData = await teachersDischiplinesRepository.getTeachersDisciplinesById(teacherId, disciplineId)

    if(!teachersDisciplineData){
        throw{
            code: "not found",
            message: "This teacher or discipline id do not exist"
        }
    }

    return teachersDisciplineData
}

async function checkTestName(name: string){
    const testData =  await testsRepository.getTestByName(name)
    console.log(testData)

    if(testData){
        throw{
            code: "conflict",
            message: "This name already exists"
        }
    }

}

export async function getTestsByDiscipline(){
    
}

export async function getTestsCategory(){
    const testsByDiscipline = await testsRepository.getTestsCategory()
    const formatedTest : TestByDiscipline[] = [...testsByDiscipline]
    
    for(let i = 0; i < testsByDiscipline.length; i++) {
        const disciplines = testsByDiscipline[i].disciplines;
        
        for(let j = 0; j < disciplines.length; j++) {
          const teachersDisciplines = disciplines[j].TeachersDisciplines;
          const testsByCategory = [];
    
          for(let k = 0; k < teachersDisciplines.length; k++) {
            const emptyTest = teachersDisciplines[k].Test;
    
            for(let l = 0; l < emptyTest.length; l++) {
              testsByCategory.push({
                name: emptyTest[l].categories.name,
                tests: emptyTest[l].categories.Test.map(test => {
                  const formatedTest = {
                    name: test.name,
                    pdfUrl: test.pdfUrl,
                    teacher: test.teachersDisciplines.teachers.name
                  };
    
                  return formatedTest;
                })
              });
            }
          }
    
          delete formatedTest[i].disciplines[j].TeachersDisciplines;
          formatedTest[i].disciplines[j].categories = testsByCategory;
        }
      }
      
    return formatedTest;
}

export async function getTestsTeacher() {
    const tests = await testsRepository.getTestsGroupByTeacher();
    const formatedTestsTeacher: TestByTeacher[] = { ...tests };
  
    for(let i = 0; i < tests.length; i++) {
      const teachersDisciplines = tests[i].TeachersDisciplines;
  
      for(let j = 0; j < teachersDisciplines.length; j++) {
        const emptyTest = teachersDisciplines[j].Test;
        const testsByCategory = [];
  
          for(let k = 0; k < emptyTest.length; k++) {
            testsByCategory.push({
              name: emptyTest[k].categories.name,
              tests: emptyTest[k].categories.Test.map(test => {
                const formatedTest = {
                  name: test.name,
                  pdfUrl: test.pdfUrl,
                  discipline: test.teachersDisciplines.disciplines.name
                };
  
                return formatedTest;
              })
            });
        }
  
        delete formatedTestsTeacher[i].TeachersDisciplines
        formatedTestsTeacher[i].categories = testsByCategory;
      }
    }
  
    return tests;
  }
