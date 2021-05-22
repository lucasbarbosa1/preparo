const express = require('express');

const authMiddleware = require('../middlewares/auth');

const multer = require('multer');
const fs = require('fs');
const multerConfig = require('../middlewares/multerConfig');
const upload = multer(multerConfig);

const { body, validationResult } = require('express-validator');



const User = require('../models/user');
const LocalUser = require('../models/localization');

const router = express.Router();

router.use(authMiddleware);

// Busca as informações salvas do usuário.

router.get('/formsperfil', async (req, res) => {
    try {
        const dataUser = await User.findById(req.userId);

        res.send({ dataUser });
    } catch (err) {
        return res.status(400).send({ error: 'Erro ao buscar dados do usuario!' });
    }
});

// Armazena, atualiza e exclui informações do usuário (incluindo imagem de perfil)
// Caso o usuário não altere os campos preenchidos, seus dados serão os mesmos.
// caso altere os campos já preenchidos, seus dados serão sobrepostos.
// caso apague os campos preenchidos, seus dados são apagados.

router.post('/formsperfil',
    upload.single('file'),
    body('email').isEmail(),
    body('name').notEmpty(),
    body('surname').notEmpty(),
    body('phone').isMobilePhone('pt-BR'),
    async (req, res) => {
        // validação dos dados do usuário.
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });


        const old_img = await User.findById(req.userId);
        const pathToFile = old_img.avatar;
        if (req.file.filename !== undefined) {

            // Exclui imagem anterior do usuario.
            await fs.unlink(pathToFile, function (err) {
                if (err) {
                    console.log("Imagem não excluída! Possivelmente não havia imagem anteriormente.");
                } else {
                    console.log("Imagem excluída com sucesso!");
                }
            });
        }
        try {
            const image_url = `./public/uploads/${req.file.filename}`;

            const { email, name, surname,
                phone, github, behance, linkedin } = req.body;

            const dataUser = await User.findByIdAndUpdate(
                req.userId,
                { email, name, surname, phone, github, behance, linkedin, avatar: image_url }, {
                new: true
            });

            return res.send({ dataUser });
        } catch (err) {
            return res.status(400).send({ error: 'Erro ao atualizar dados do usuario!' });
        }
    });

// Busca dados armazenados sobre a localização do usuário.
router.get('/formslocalizacao', async (req, res) => {
    try {
        const localUser = await LocalUser.findOne({ user: req.userId });

        return res.send({ localUser });
    } catch (err) {
        return res.status(400).send({ error: 'Erro ao buscar dados da localização!' });
    }
});

// Armazena, edita e exclui informações da pagina localização.
// Caso o usuário não altere os campos preenchidos, seus dados serão os mesmos.
// caso altere os campos já preenchidos, seus dados serão sobrepostos.
// caso apague os campos preenchidos, seus dados são apagados.

router.post('/formslocalizacao', async (req, res) => {
    try {
        const localUser = await LocalUser.findOneAndUpdate({ user: req.userId }, req.body, {
            new: true
        });

        return res.send({ localUser });

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao atualizar dados da localização!' });
    }
});

module.exports = app => app.use('/perfil', router);