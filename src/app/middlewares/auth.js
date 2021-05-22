const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(400).send({ ERRO: 'TOKEN INEXISTENTE!'});

    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).send({ ERRO: 'ERRO DE TOKEN' });

    const [ scheme, token ] = parts;
    
    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ ERRO: 'TOKEN CORROMPIDO' });


    jwt.verify(token, authConfig.secret, (err, decoded) =>{
        if (err) return res.status(400).send({ ERRO: 'TOKEN INVALIDO!'});

        req.userId = decoded.id;
        return next();
    });    
};