require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "supersecretkey"; 

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});

app.post("/token", (req, res) => {
    const user = { username: "test_user" };
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
    res.json({ access_token: token });
});

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
}

app.get("/secure-data", authenticate, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}!` });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
