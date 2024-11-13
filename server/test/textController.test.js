const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { textController } = require("../controllers/adminControllers"); // Путь к вашему контроллеру

const app = express();
app.use(express.json());

// Маршруты для тестирования
app.get("/loadText", textController.loadText);
app.post("/saveText", textController.saveText);

describe("Text Controller", () => {
    describe("GET /loadText", () => {
        it("should return the main text from the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { mainText: "Test Main Text" };
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/loadText");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("MainText", "Test Main Text");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 404 if main text is not found", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {};
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/loadText");

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual("Текст не найден");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).get("/loadText");

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Не удалось загрузить файл конфигурации!");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });
    });

    describe("POST /saveText", () => {
        it("should save the main text to the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { mainText: "Initial Text" };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(null);
            });

            const newText = "Updated Text";
            const res = await request(app).post("/saveText").send({ text: newText });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Текст успешно сохранен");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).post("/saveText").send({ text: "Test Text" });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении файла");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not writable", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { mainText: "Initial Text" };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile для возврата ошибки
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).post("/saveText").send({ text: "Test Text" });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при сохранении текста в файл");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });
    });
});
