
const User = require("../models/User");

class UserRepository {

    // Houni nlawejo utilisateur bel login
    async findByLogin(login) {
        return await User.findOne({ login }).select("+password");
    }

    // Houni n3amlou creation mta3 utilisateur
    async create(userData) {
        return await User.create(userData);
    }

    // Houni nal9aw utilisateur bel ID
    async findById(id) {
        return await User.findById(id);
    }
}

module.exports = new UserRepository();
