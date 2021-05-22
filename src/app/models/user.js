const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: true,
        select: false,
    },
    name: {
        type: String,
        require: true,
    },
    surname: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    github: {
        type: String,
    },
    behance: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    avatar: {
        type: String,
    }
});

UserSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;