import {faker} from "@faker-js/faker";

export default async function userFactory() : Promise <{email: string, password: string, passwordConfirmation: string}> {
    const password: string = faker.internet.password();
    return {
        email: faker.internet.email(),
        password: password,
        passwordConfirmation: password
    }
}