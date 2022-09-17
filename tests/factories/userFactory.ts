import {faker} from "@faker-js/faker";

export async function signUpFactory() : Promise <{email: string, password: string, passwordConfirmation: string}> {
    const password: string = faker.internet.password();
    return {
        email: faker.internet.email(),
        password: password,
        passwordConfirmation: password
    }
}

export async function signInFactory() : Promise <{email: string, password: string}> {
    return {
        email: faker.internet.email(),
        password: faker.internet.password(),
    }
}