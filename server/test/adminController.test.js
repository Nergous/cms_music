const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");
const updateCredentialsController = require("../controllers/adminControllers/adminController"); // Путь к вашему контроллеру

const app = express();
app.use(express.json());

// Маршрут для тестирования
app.post("/updateCredentials", updateCredentialsController.updateCredentials);

describe("Update Credentials Controller", () => {
    describe("POST /updateCredentials", () => {
        it("should update the credentials in the .env file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = `REACT_APP_ADMIN_LOGIN=old_login\nREACT_APP_ADMIN_PASSWORD=old_password`;
                callback(null, testData);
            });

            // Мокаем fs.writeFile
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(null);
            });

            const newLogin = "new_login";
            const newPassword = "new_password";
            const res = await request(app)
                .post("/updateCredentials")
                .send({ login: newLogin, password: newPassword });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Данные успешно обновлены");

            // Проверяем, что fs.writeFile был вызван с правильными данными
            expect(fs.writeFile).toHaveBeenCalledWith(
                expect.any(String),
                `REACT_APP_ADMIN_LOGIN=${newLogin}\nREACT_APP_ADMIN_PASSWORD=${newPassword}`,
                expect.any(Function)
            );

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });

        it("should return 500 if the .env file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/updateCredentials")
                .send({ login: "test_login", password: "test_password" });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении файла .env");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the .env file is not writable", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = `REACT_APP_ADMIN_LOGIN=old_login\nREACT_APP_ADMIN_PASSWORD=old_password`;
                callback(null, testData);
            });

            // Мокаем fs.writeFile для возврата ошибки
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/updateCredentials")
                .send({ login: "test_login", password: "test_password" });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при обновлении .env файла");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });
    });
});