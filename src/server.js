// imporation lel variables eli mawjouda fi fichier .env
require("dotenv").config();
// imporation l'application Express
const app = require("./app");
// imporation lel fonction eli bch na3mlo biha connexion m3a base de données MongoDB
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;
//fonction bch na3mlo biha connexion m3a base de données MongoDB w bch nstartiw server
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Serveur demarre sur le port ${PORT}`);
    });
};

startServer();
