const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const authConfig = require('../../config/auth');

const User = require('../models/user');
const LocalUser = require('../models/localization');

const router = express.Router();


// gera o token que vai validar o usuario a acessar paginas de Dados Básicos
// e Localização.

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

// Cadastro do usuário e suas validações.

router.post('/signup',
    body('email').isEmail(),
    async (req, res) => {
        try {
            const { email } = req.body;
            const error = validationResult(req);
            if (!error.isEmpty())
                return res.status(400).send({ ERRO: 'Email inválido' });

            if (req.body.password !== req.body.repeat_password)
                return res.status(400).send({ ERRO: 'As senhas não são iguais!' });

            if (req.body.password.length < 6) {
                return res.status(400).send({ ERRO: 'A senha não é forte o suficiente' });
            }

            if (await User.findOne({ email }))
                return res.status(400).send({ ERRO: 'O E-mail correspondente já existe!' });

            const user = await User.create(req.body);
            user.password = undefined;
            await LocalUser.create({ user: user.id });

            return res.send({
                user,
                token: generateToken({ id: user.id }),
            });

        } catch (err) {
            return res.status(400).send({ ERRO: 'Falha no registro' });
        }
    });


// Autenticação do usuário.

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user)
            return res.status(400).send({ ERRO: 'Verifique se o email e senha estão corretos.' });


        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ ERRO: 'Verifique se o email e senha estão corretos.' })

        user.password = undefined;

        res.send({
            user,
            token: generateToken({ id: user.id }),
        });
    } catch {
        return res.status(400).send({ ERRO: 'Erro ao fazer login' });
    }


});

module.exports = app => app.use('/', router);