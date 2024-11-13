const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");
const colorController = require("../controllers/adminControllers/colorController"); // Путь к вашему контроллеру

const app = express();
app.use(express.json());

// Маршруты для тестирования
app.get("/getColors", colorController.getColors);
app.post("/saveColors", colorController.saveColors);
app.get("/getFontColors", colorController.getFontColors);
app.post("/saveFontColors", colorController.saveFontColors);
app.get("/getIconColors", colorController.getIconColors);
app.post("/saveIconColors", colorController.saveIconColors);

describe("Color Controller", () => {
    describe("GET /getColors", () => {
        it("should return the colors from the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { colors: ["#ffffff", "#000000"] };
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/getColors");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("Colors", ["#ffffff", "#000000"]);

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 404 if colors are not found", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {};
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/getColors");

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual("Цвета не найдены");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).get("/getColors");

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Не удалось загрузить файл конфигурации!");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });
    });

    describe("POST /saveColors", () => {
        it("should save the colors to the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { colors: ["#ffffff", "#000000"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(null);
            });

            const newColors = ["#ff0000", "#00ff00"];
            const res = await request(app)
                .post("/saveColors")
                .send({ Colors: newColors });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Цвета успешно сохранены");

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
                .post("/saveColors")
                .send({ Colors: ["#ff0000", "#00ff00"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении файла");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not writable", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { colors: ["#ffffff", "#000000"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile для возврата ошибки
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/saveColors")
                .send({ Colors: ["#ff0000", "#00ff00"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при сохранении цветов в файл");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });
    });

    describe("GET /getFontColors", () => {
        it("should return the font colors from the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { fontColors: ["#ffffff", "#000000"] };
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/getFontColors");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("FontColors", ["#ffffff", "#000000"]);

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 404 if font colors are not found", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {};
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/getFontColors");

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual("Цвета не найдены");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).get("/getFontColors");

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Не удалось загрузить файл конфигурации!");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });
    });

    describe("POST /saveFontColors", () => {
        it("should save the font colors to the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { fontColors: ["#ffffff", "#000000"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(null);
            });

            const newColors = ["#ff0000", "#00ff00"];
            const res = await request(app)
                .post("/saveFontColors")
                .send({ FontColors: newColors });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Цвета успешно сохранены");

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
                .post("/saveFontColors")
                .send({ FontColors: ["#ff0000", "#00ff00"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении файла");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not writable", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { fontColors: ["#ffffff", "#000000"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile для возврата ошибки
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/saveFontColors")
                .send({ FontColors: ["#ff0000", "#00ff00"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при сохранении цветов в файл");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });
    });

    describe("GET /getIconColors", () => {
        it("should return the icon colors from the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { iconColors: ["#ffffff", "#000000"] };
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/getIconColors");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("IconColors", ["#ffffff", "#000000"]);

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 404 if icon colors are not found", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {};
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/getIconColors");

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual("Цвета не найдены");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).get("/getIconColors");

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Не удалось загрузить файл конфигурации!");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });
    });

    describe("POST /saveIconColors", () => {
        it("should save the icon colors to the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { iconColors: ["#ffffff", "#000000"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(null);
            });

            const newColors = ["#ff0000", "#00ff00"];
            const res = await request(app)
                .post("/saveIconColors")
                .send({ IconColors: newColors });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Цвета успешно сохранены");

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
                .post("/saveIconColors")
                .send({ IconColors: ["#ff0000", "#00ff00"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении файла");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not writable", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { iconColors: ["#ffffff", "#000000"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile для возврата ошибки
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/saveIconColors")
                .send({ IconColors: ["#ff0000", "#00ff00"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при сохранении цветов в файл");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });
    });
});