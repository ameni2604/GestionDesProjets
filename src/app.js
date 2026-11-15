
const express = require("express");
// Importation des routes
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/tasksRoutes");

const app = express();

app.use(express.json());

// Route de test
app.get("/", (req, res) => {
    res.json({
        message: "API Gestion de Projets fonctionne"
    });
});

// Routes d'authentification
app.use("/api/auth", authRoutes);
// Routes pour les projets
app.use("/api/projects", projectRoutes);
// Routes pour les tâchesb
app.use("/api", taskRoutes);

module.exports = app;
