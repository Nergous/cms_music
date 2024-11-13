const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");
const footerController = require("../controllers/adminControllers/footerController"); // Путь к вашему контроллеру

const app = express();
app.use(express.json());

// Маршруты для тестирования
app.get("/loadFooter", footerController.loadFooter);
app.post("/saveFooter", footerController.saveFooter);
app.get("/loadSocials", footerController.loadSocials);
app.post("/saveSocials", footerController.saveSocials);

describe("Footer Controller", () => {
    describe("GET /loadFooter", () => {
        it("should return the footer text from the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { footerText: "Test Footer Text" };
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/loadFooter");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("FooterText", "Test Footer Text");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 404 if footer text is not found", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {};
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/loadFooter");

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual("Текст подвала не найден");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).get("/loadFooter");

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Не удалось загрузить файл конфигурации!");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });
    });

    describe("POST /saveFooter", () => {
        it("should save the footer text to the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { footerText: "Initial Footer Text" };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(null);
            });

            const newFooterText = "Updated Footer Text";
            const res = await request(app)
                .post("/saveFooter")
                .send({ footerText: newFooterText });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Текст подвала успешно сохранен");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/saveFooter")
                .send({ footerText: "Test Footer Text" });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении файла");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not writable", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { footerText: "Initial Footer Text" };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile для возврата ошибки
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/saveFooter")
                .send({ footerText: "Test Footer Text" });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при сохранении текста подвала в файл");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });
    });

    describe("GET /loadSocials", () => {
        it("should return the socials from the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { socials: ["Facebook", "Twitter"] };
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/loadSocials");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("Socials", ["Facebook", "Twitter"]);

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 404 if socials are not found", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {};
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/loadSocials");

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual("Социальные сети не найдены");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).get("/loadSocials");

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Не удалось загрузить файл конфигурации!");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });
    });

    describe("POST /saveSocials", () => {
        it("should save the socials to the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { socials: ["Facebook", "Twitter"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(null);
            });

            const newSocials = ["Instagram", "LinkedIn"];
            const res = await request(app)
                .post("/saveSocials")
                .send({ socials: newSocials });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Социальные сети успешно сохранены");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/saveSocials")
                .send({ socials: ["Instagram", "LinkedIn"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении файла");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not writable", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { socials: ["Facebook", "Twitter"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile для возврата ошибки
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/saveSocials")
                .send({ socials: ["Instagram", "LinkedIn"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при сохранении социальных сетей в файл");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });
    });
});