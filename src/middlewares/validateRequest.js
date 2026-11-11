const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {

    // Njibou les erreurs eli sarou fel validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Erreur de validation",
            errors: errors.array().map(error => ({
                champ: error.path,
                message: error.msg
            }))
        });
    }

    next();
};

module.exports = validateRequest;
