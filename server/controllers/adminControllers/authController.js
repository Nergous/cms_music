const env = require("dotenv");
const jwt = require("jsonwebtoken");

env.config();

exports.authenticate = (req, res) => {
    const { username, password } = req.body;

    if (username === process.env.REACT_APP_ADMIN_LOGIN && password === process.env.REACT_APP_ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.cookie("token", token, { httpOnly: true });
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({
            success: false,
            message: "Ошибка авторизации",
        });
    }
};

exports.checkAuth = (req, res) => {
    res.status(200).json({ success: true });
};