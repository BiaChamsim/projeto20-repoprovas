import {faker} from "@faker-js/faker";

export default async function createPost() : Promise <{name: string, pdfUrl: string, category: string, subject: string, teacher: string}> {

    return {
        name: faker.lorem.text(),
        pdfUrl: faker.internet.url(),
        category: "Projeto",
        subject: "React",
        teacher: "Diego Pinho"
    }
}

