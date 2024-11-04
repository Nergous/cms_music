const allowedOrigins = ["http://localhost:3000","http://localhost:3001", "https://tubiofficial.ru" ];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, origin);
        } else {
            callback(new Error("Доступ запрещен"));
        }
    },
    credentials: true,
};

module.exports = corsOptions;
