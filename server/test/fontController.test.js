const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");
const fontController = require("../controllers/adminControllers/fontController"); // Путь к вашему контроллеру

const app = express();
app.use(express.json());

// Маршруты для тестирования
app.get("/getFont", fontController.getFont);
app.post("/saveFont", fontController.saveFont);
app.delete("/deleteFont", fontController.deleteFont);

describe("Font Controller", () => {
    describe("GET /getFont", () => {
        it("should return the fonts from the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { fonts: ["Arial", "Times New Roman"] };
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/getFont");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("Font", ["Arial", "Times New Roman"]);

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 404 if fonts are not found", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {};
                callback(null, JSON.stringify(testData));
            });

            const res = await request(app).get("/getFont");

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual("Шрифт не найден");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).get("/getFont");

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Не удалось загрузить файл конфигурации!");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });
    });

    describe("POST /saveFont", () => {
        it("should save the fonts to the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { fonts: ["Arial", "Times New Roman"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(null);
            });

            const newFonts = ["Helvetica", "Courier New"];
            const res = await request(app).post("/saveFont").send({ fonts: newFonts });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Шрифт успешно сохранен");

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
                .post("/saveFont")
                .send({ fonts: ["Helvetica", "Courier New"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении файла");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not writable", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = { fonts: ["Arial", "Times New Roman"] };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile для возврата ошибки
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app)
                .post("/saveFont")
                .send({ fonts: ["Helvetica", "Courier New"] });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при сохранении шрифта в файл");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });
    });

    describe("DELETE /deleteFont", () => {
        it("should delete the specified font from the configuration file", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {
                    fonts: {
                        available_fonts: ["Arial", "Times New Roman", "Courier New"],
                        selected_font: "Arial",
                    },
                };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(null);
            });

            const fontToDelete = "Times New Roman";
            const res = await request(app).delete("/deleteFont").send({ font: fontToDelete });

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Шрифт успешно удален");

            // Проверяем, что шрифт был удален из списка
            const updatedData = JSON.parse(fs.writeFile.mock.calls[0][1]);
            expect(updatedData.fonts.available_fonts).toEqual(["Arial", "Courier New"]);
            expect(updatedData.fonts.selected_font).toEqual("Arial");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });

        it("should return 404 if the font is not found", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {
                    fonts: {
                        available_fonts: ["Arial", "Times New Roman", "Courier New"],
                        selected_font: "Arial",
                    },
                };
                callback(null, JSON.stringify(testData));
            });

            const fontToDelete = "NonExistentFont";
            const res = await request(app).delete("/deleteFont").send({ font: fontToDelete });

            expect(res.statusCode).toEqual(404);
            expect(res.text).toEqual("Шрифт не найден");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not readable", async () => {
            // Мокаем fs.readFile для возврата ошибки
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).delete("/deleteFont").send({ font: "Arial" });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении файла");

            // Восстанавливаем оригинальную функцию
            fs.readFile.mockRestore();
        });

        it("should return 500 if the configuration file is not writable", async () => {
            // Мокаем fs.readFile
            jest.spyOn(fs, "readFile").mockImplementation((filePath, encoding, callback) => {
                const testData = {
                    fonts: {
                        available_fonts: ["Arial", "Times New Roman", "Courier New"],
                        selected_font: "Arial",
                    },
                };
                callback(null, JSON.stringify(testData));
            });

            // Мокаем fs.writeFile для возврата ошибки
            jest.spyOn(fs, "writeFile").mockImplementation((filePath, data, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).delete("/deleteFont").send({ font: "Arial" });

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при удалении шрифта из файла");

            // Восстанавливаем оригинальные функции
            fs.readFile.mockRestore();
            fs.writeFile.mockRestore();
        });
    });
});
