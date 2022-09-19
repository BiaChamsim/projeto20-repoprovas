import prisma from "../databases/postgres";
import {UserTest} from "../types/testType";

export async function getTestByName(name: string){
    const testData = await prisma.test.findFirst({where: {name}})
    return testData
}

export async function insert(newTest: UserTest) {
    await prisma.test.create({data: newTest})
}

export async function getTestsCategory(){
    const tests = await prisma.term.findMany(
        {
          select: {
            number: true,
            disciplines: {
              select: {
                name: true,
                TeachersDisciplines: {
                  select: {
                    Test: {
                      select: {
                        categories: {
                          select: {
                            name: true,
                            Test: {
                              select: {
                                name: true,
                                pdfUrl: true,
                                teachersDisciplines: {
                                  select: {
                                    teachers: {
                                      select: {
                                        name: true
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      },
                      distinct: ['categoryId']
                    }
                  }
                }
              }
            }
          }
        }
      );
    
      return tests;
}

export async function getTestsGroupByTeacher() {
  const tests = await prisma.teacher.findMany(
    {
      select: {
        name: true,
        TeachersDisciplines: {
          select: {
            Test: {
              select: {
                categories: {
                  select: {
                    name: true,
                    Test: {
                      select: {
                        name: true,
                        pdfUrl: true,
                        teachersDisciplines: {
                          select: {
                            disciplines: {
                              select: {
                                name: true
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              distinct: ['categoryId']
            }
          }
        }
      }
    }
  );

  return tests;
}