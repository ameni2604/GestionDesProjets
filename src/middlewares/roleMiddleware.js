const authorize = (...roles) => {

    return (req, res, next) => {

        // Nthabtou ken el utilisateur 3andou role autorisé
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Acces interdit"
            });
        }

        next();
    };
};

module.exports = authorize;
