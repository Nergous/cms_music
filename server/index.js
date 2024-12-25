const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const swaggerSetup = require("./swagger/swagger");
const app = express();

const db = require("./models");
const corsOptions = require("./middleware/cors");

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());

const gig_membersRouter = require("./routes/gig_members");
const tracksRouter = require("./routes/tracks");
const membersRouter = require("./routes/members");
const recordRouter = require("./routes/record");
const tracks_in_recordRouter = require("./routes/tracks_in_record");
const member_roleRouter = require("./routes/member_roles");
const music_authorsRouter = require("./routes/music_authors");
const gigsRouter = require("./routes/gigs");
const music_roleRouter = require("./routes/music_roles");
const adminRouter = require("./routes/admin");

app.use("/api/gig_members", gig_membersRouter);
app.use("/api/tracks", tracksRouter);
app.use("/api/members", membersRouter);
app.use("/api/record", recordRouter);
app.use("/api/tracks_in_record", tracks_in_recordRouter);
app.use("/api/member_roles", member_roleRouter);
app.use("/api/music_authors", music_authorsRouter);
app.use("/api/gigs", gigsRouter);
app.use("/api/music_roles", music_roleRouter);
app.use("/api/admin", adminRouter);

// Обслуживание статических файлов
app.use("/api/uploads", express.static(path.join(__dirname, "../client/public/uploads")));
app.use(express.static(path.join(__dirname, "../client/public/uploads")));

swaggerSetup(app);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/public", "index.html"));
});


const PORT = process.env.PORT || 3001;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
