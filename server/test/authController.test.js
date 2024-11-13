const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/adminControllers/authController"); // Путь к вашему контроллеру

const app = express();
app.use(express.json());

// Маршруты для тестирования
app.post("/authenticate", authController.authenticate);
app.get("/checkAuth", authController.checkAuth);

describe("Auth Controller", () => {
    describe("POST /authenticate", () => {
        it("should authenticate user and return a token", async () => {
            // Мокаем process.env для тестовых данных
            process.env.REACT_APP_ADMIN_LOGIN = "test_login";
            process.env.REACT_APP_ADMIN_PASSWORD = "test_password";
            process.env.JWT_SECRET = "test_secret";

            const res = await request(app)
                .post("/authenticate")
                .send({
                    username: "test_login",
                    password: "test_password",
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("success", true);
            expect(res.headers).toHaveProperty("set-cookie");

            const token = res.headers["set-cookie"][0].split(";")[0].split("=")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            expect(decoded).toHaveProperty("username", "test_login");
        });

        it("should return 401 for invalid credentials", async () => {
            // Мокаем process.env для тестовых данных
            process.env.REACT_APP_ADMIN_LOGIN = "test_login";
            process.env.REACT_APP_ADMIN_PASSWORD = "test_password";

            const res = await request(app)
                .post("/authenticate")
                .send({
                    username: "invalid",
                    password: "invalid",
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty("success", false);
            expect(res.body).toHaveProperty("message", "Ошибка авторизации");
        });
    });

    describe("GET /checkAuth", () => {
        it("should return success status", async () => {
            const res = await request(app).get("/checkAuth");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("success", true);
        });
    });
});