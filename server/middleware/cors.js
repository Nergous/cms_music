const allowedOrigins = ["https://localhost:3000", "https://tubiofficial.ru", "http://localhost:3001"];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Доступ запрещен"));
        }
    },
    credentials: true,
};

module.exports = corsOptions;
