const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const LocalizationSchema = new mongoose.Schema({
    cep: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    state: {
        type: String,
        require: true,
    },
    neighborhood: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    number: {
        type: Number,
        require: true,
    },
    complement: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    }
});

const Localization = mongoose.model('Localization', LocalizationSchema);

module.exports = Localization;