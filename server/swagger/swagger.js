const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API cms-music",
            version: "1.0.0",
            description: "Описание API-endpoint`ов приложения cms-music by Nergous",
        },
        servers: [
            {
                url: "http://localhost:3001/api",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: 'cookie',
                    name: "token",
                    description: "JWT",
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },
    apis: [
        path.join(__dirname, "/docs/*.yaml"),
        path.join(__dirname, "/schemas/*.yaml"),
    ], // Путь к файлам с описанием API
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
