
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Route de test
app.get("/", (req, res) => {
    res.json({
        message: "API Gestion de Projets fonctionne"
    });
});

// Routes d'authentification
app.use("/api/auth", authRoutes);

module.exports = app;
