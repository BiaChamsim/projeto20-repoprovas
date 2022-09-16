import app from "../src/index";
import supertest from "supertest";
import prisma from "../src/databases/postgres";
import userFactory from "./factories/userFactory"; 


beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users`
})
describe('testa rota /signup', () => {
    it('body vazio deve retornar 422', async () => {
        const body = {}

        const response = await supertest(app).post('/signup').send(body)

        expect(response.status).toBe(422);
    });

    it('email repetido deve retornar 409', async () =>{
        const registerUser =  await userFactory();

        const registerResponse = await supertest(app).post('/signup').send(registerUser)
        const conflictResponse = await supertest(app).post('/signup').send(registerUser)

        expect(registerResponse.status).toBe(201)
        expect(conflictResponse.status).toBe(409)

    })

    it('cadastro realizado deve retornar 201', async () => {
        const registerUser = await userFactory();

        const registerResponse = await supertest(app).post('/signup').send(registerUser);
        expect(registerResponse.status).toBe(201)
    })
});

afterAll(async () => {
    await prisma.$disconnect()
})