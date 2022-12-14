import app from "../src/index";
import supertest from "supertest";
import prisma from "../src/databases/postgres";
import createPost from "./factories/testsFactory";
import {signUpFactory} from "./factories/userFactory";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE users`
    await prisma.$executeRaw`TRUNCATE TABLE tests`
})

describe('testa rota /signup', () => {
    it('body vazio deve retornar 422', async () => {
        const body = {}
        const response = await supertest(app).post('/signup').send(body)
        expect(response.status).toBe(422);
    });

    it('email repetido deve retornar 409', async () => {
        const registerUser =  await signUpFactory();

        const registerResponse = await supertest(app).post('/signup').send(registerUser)
        const conflictResponse = await supertest(app).post('/signup').send(registerUser)

        expect(registerResponse.status).toBe(201)
        expect(conflictResponse.status).toBe(409)

    })

    it('cadastro realizado deve retornar 201', async () => {
        const registerUser = await signUpFactory();

        const registerResponse = await supertest(app).post('/signup').send(registerUser);
        
        expect(registerResponse.status).toBe(201);
        expect(registerResponse.body).not.toBeNull();
    })
});

describe('testa rota /signin', () => {
    it('body no formato incorreto deve retornar 422', async () => {
        const body = {}
        const user = await signUpFactory()

        const registerResponse = await supertest(app).post('/signup').send(user);
        const signInResponse = await supertest(app).post('/signin').send(body)
        
        expect(registerResponse.status).toBe(201);
        expect(signInResponse.status).toBe(422);
    })

    it('email inválido deve retornar 401', async () => {
        const registerSignUp = await signUpFactory();

        const nonExistentEmail = {email: "emailErrado@email.com", password: "1234567890"} 
        
        const registerResponse = await supertest(app).post('/signup').send(registerSignUp)
        const conflictResponse = await supertest(app).post('/signin').send(nonExistentEmail)
      
        expect(registerResponse.status).toBe(201)
        expect(conflictResponse.status).toBe(401)
    })

    it('senha inválida deve retornar 401', async () => {
        const user = await signUpFactory();
        const nonExistentPassword = {email: user.email, password: "senhaErrada"}

        const registerResponse = await supertest(app).post('/signup').send(user)
        const conflictResponse = await supertest(app).post('/signin').send(nonExistentPassword)

        expect(registerResponse.status).toBe(201);
        expect(conflictResponse.status).toBe(401)
    })

    it('signin realizado deve retornar status 200 e token', async () => {
        const user = await signUpFactory()
        const signin = {email: user.email, password: user.password}

        const registerResponse = await supertest(app).post('/signup').send(user)
        const signInResponse = await supertest(app).post('/signin').send(signin)

        expect(registerResponse.status).toBe(201);
        expect(signInResponse.status).toBe(200);
        expect(signInResponse.body.token).not.toBeUndefined();
    })
})

describe('testa a rota /test', () => {
    it('retorna 201 para token e body válidos', async () => {
        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}

        const registerResponse = await supertest(app).post('/signup').send(signUp)
        const loginResponse = await supertest(app).post('/signin').send(signIn)
        
        expect(registerResponse.status).toBe(201)
        expect(loginResponse.body.token).not.toBeUndefined()

        const testBody = await createPost();
        const token = loginResponse.body.token;

        const createdTestResponse = await supertest(app).post('/test').set('Authorization', `Bearer ${token}`).send(testBody)

        expect(createdTestResponse.status).toBe(201)
        expect(createdTestResponse.body).not.toBeNull()
        
    })

    it('retorna 422 para body inválido', async () => {
        const body = {};
        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}

        const registerResponse = await supertest(app).post('/signup').send(signUp);
        const signInResponse = await supertest(app).post('/signin').send(signIn)
        const token = signInResponse.body.token;
        
        expect(registerResponse.status).toBe(201);
        expect(signInResponse.status).toBe(200);
        
        const result = await supertest(app).post('/test').set('Authorization', `Bearer ${token}`).send(body);        
        
        expect(result.status).toBe(422)
    })

    it('retorna 401 para token inválido', async () => {
        const invalidToken = "abc123";

        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}
        const testBody = await createPost();

        const registerResponse = await supertest(app).post('/signup').send(signUp);
        const signInResponse = await supertest(app).post('/signin').send(signIn)
        
        expect(registerResponse.status).toBe(201);
        expect(signInResponse.status).toBe(200);
        
        const result = await supertest(app).post('/test').set('Authorization', `Bearer ${invalidToken}`).send(testBody);        
        
        expect(result.status).toBe(401)

    })

    it("retorna 404 se 'category' não constar no banco de dados", async () => {
        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}
        const test = await createPost();

        const nonExistentCategory = {...test, category: "non existent"}

        const registerResponse = await supertest(app).post('/signup').send(signUp)
        const loginResponse = await supertest(app).post('/signin').send(signIn)

        const token = loginResponse.body.token

        expect(registerResponse.status).toBe(201)
        expect(loginResponse.status).toBe(200)

        const registerTestResponse = await supertest(app).post('/test').set('Authorization', `Bearer ${token}`).send(nonExistentCategory)

        expect(registerTestResponse.status).toBe(404)
    })

    it("retorna 404 se 'discipline' não constar no banco de dados", async () => {
        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}
        const test = await createPost();

        const nonExistentCategory = {...test, subject: "non existent"}

        const registerResponse = await supertest(app).post('/signup').send(signUp)
        const loginResponse = await supertest(app).post('/signin').send(signIn)

        const token = loginResponse.body.token

        expect(registerResponse.status).toBe(201)
        expect(loginResponse.status).toBe(200)

        const registerTestResponse = await supertest(app).post('/test').set('Authorization', `Bearer ${token}`).send(nonExistentCategory)

        expect(registerTestResponse.status).toBe(404)
    })

    it("retorna 404 se 'teacher' não constar no banco de dados", async () => {
        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}
        const test = await createPost();

        const nonExistentCategory = {...test, teacher: "non existent"}

        const registerResponse = await supertest(app).post('/signup').send(signUp)
        const loginResponse = await supertest(app).post('/signin').send(signIn)

        const token = loginResponse.body.token

        expect(registerResponse.status).toBe(201)
        expect(loginResponse.status).toBe(200)

        const registerTestResponse = await supertest(app).post('/test').set('Authorization', `Bearer ${token}`).send(nonExistentCategory)

        expect(registerTestResponse.status).toBe(404)
    })

})

describe("testa o 'get' da rota /test-subject", () => {
    it('retorna 401 para token inválido', async () => {
        const invalidToken = "abc123";

        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}
        const testBody = await createPost();

        const registerResponse = await supertest(app).post('/signup').send(signUp);
        const signInResponse = await supertest(app).post('/signin').send(signIn)
        
        expect(registerResponse.status).toBe(201);
        expect(signInResponse.status).toBe(200);
        
        const result = await supertest(app).get('/test-discipline').set('Authorization', `Bearer ${invalidToken}`).send(testBody);        
        
        expect(result.status).toBe(401)
    })

    it('retorna 200 e o body no formato correto', async () => {
        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}

        const registerResponse = await supertest(app).post('/signup').send(signUp);
        const signInResponse = await supertest(app).post('/signin').send(signIn);
        const token = signInResponse.body.token;
        
        expect(registerResponse.status).toBe(201);
        expect(signInResponse.status).toBe(200);

        const testsDisciplineResult = await supertest(app).get('/test-discipline').set('Authorization', `Bearer ${token}`);        

        expect(testsDisciplineResult.status).toBe(200)
        expect(testsDisciplineResult.body).toBeInstanceOf(Array)
        
    })
})

describe("testa o 'get' da rota /test-teacher", () => {
    it('retorna 401 para token inválido', async () => {
        const invalidToken = "abc123";

        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}
        const testBody = await createPost();

        const registerResponse = await supertest(app).post('/signup').send(signUp);
        const signInResponse = await supertest(app).post('/signin').send(signIn)
        
        expect(registerResponse.status).toBe(201);
        expect(signInResponse.status).toBe(200);
        
        const result = await supertest(app).get('/test-teacher').set('Authorization', `Bearer ${invalidToken}`).send(testBody);        
        
        expect(result.status).toBe(401)
    })

    it('retorna 200 e o body no formato correto', async () => {
        const signUp = await signUpFactory();
        const signIn = {email: signUp.email, password: signUp.password}

        const registerResponse = await supertest(app).post('/signup').send(signUp);
        const signInResponse = await supertest(app).post('/signin').send(signIn);
        const token = signInResponse.body.token;
        
        expect(registerResponse.status).toBe(201);
        expect(signInResponse.status).toBe(200);

        const testsByTeacherResult = await supertest(app).get('/test-teacher').set('Authorization', `Bearer ${token}`);        

        expect(testsByTeacherResult.status).toBe(200)
        expect(testsByTeacherResult.body).toBeInstanceOf(Array)
        
    })
})


afterAll(async () => {
    await prisma.$disconnect()
})