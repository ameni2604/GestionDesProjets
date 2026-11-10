
const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

    // Nchoufou ken fama token fel Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentification requise"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // N7ottou les informations mta3 utilisateur fel request
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token invalide ou expire"
        });
    }
};

module.exports = authenticate;
