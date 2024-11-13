const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const imageController = require("../controllers/adminControllers/imageController"); // Путь к вашему контроллеру

const app = express();
app.use(express.json());

// Настройка multer для тестов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const pathDir = path.join(__dirname, "uploads");
        if (!fs.existsSync(pathDir)) {
            fs.mkdirSync(pathDir, { recursive: true });
        }
        cb(null, pathDir);
    },
    filename: (req, file, cb) => {
        cb(null, "logo.png");
    },
});
const upload = multer({ storage: storage });

// Маршруты для тестирования
app.get("/getImages", imageController.getImages);
app.delete("/deleteImage/:filename", imageController.deleteImage);
app.post("/uploadFiles", upload.array("files"), imageController.uploadFiles);
app.post("/uploadLogo", upload.single("logo"), imageController.uploadLogo);

describe("Image Controller", () => {
    describe("GET /getImages", () => {
        it("should return a list of images", async () => {
            // Мокаем fs.readdir
            jest.spyOn(fs, "readdir").mockImplementation((dir, callback) => {
                callback(null, ["image1.png", "image2.png"]);
            });

            const res = await request(app).get("/getImages");

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(["image1.png", "image2.png"]);

            // Восстанавливаем оригинальную функцию
            fs.readdir.mockRestore();
        });

        it("should return 500 if directory reading fails", async () => {
            // Мокаем fs.readdir для возврата ошибки
            jest.spyOn(fs, "readdir").mockImplementation((dir, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).get("/getImages");

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при чтении директории");

            // Восстанавливаем оригинальную функцию
            fs.readdir.mockRestore();
        });
    });

    describe("DELETE /deleteImage/:filename", () => {
        it("should delete the specified image", async () => {
            // Мокаем fs.unlink
            jest.spyOn(fs, "unlink").mockImplementation((filePath, callback) => {
                callback(null);
            });

            const res = await request(app).delete("/deleteImage/image1.png");

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Файл успешно удален");

            // Восстанавливаем оригинальную функцию
            fs.unlink.mockRestore();
        });

        it("should return 500 if file deletion fails", async () => {
            // Мокаем fs.unlink для возврата ошибки
            jest.spyOn(fs, "unlink").mockImplementation((filePath, callback) => {
                callback(new Error("Mock error"), null);
            });

            const res = await request(app).delete("/deleteImage/image1.png");

            expect(res.statusCode).toEqual(500);
            expect(res.text).toEqual("Ошибка при удалении файла");

            // Восстанавливаем оригинальную функцию
            fs.unlink.mockRestore();
        });
    });

    describe("POST /uploadFiles", () => {
        it("should upload multiple files successfully", async () => {
            const res = await request(app)
                .post("/uploadFiles")
                .attach("files", Buffer.from("file1 content"), "file1.txt")
                .attach("files", Buffer.from("file2 content"), "file2.txt");

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Файлы загружены успешно");
        });

        it("should return 400 if no files are uploaded", async () => {
            const res = await request(app).post("/uploadFiles");

            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual("Нет файлов");
        });
    });

    describe("POST /uploadLogo", () => {
        it("should upload a single logo file successfully", async () => {
            const res = await request(app)
                .post("/uploadLogo")
                .attach("logo", Buffer.from("logo content"), "logo.png");

            expect(res.statusCode).toEqual(200);
            expect(res.text).toEqual("Логотип успешно загружен");
        });

        it("should return 400 if no logo file is uploaded", async () => {
            const res = await request(app).post("/uploadLogo");

            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual("Файл не был загружен");
        });
    });
});