const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve('./public/uploads'),
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, res) => {
                if (err) return cb(err);

                return cb(null, res.toString('hex') + path.extname(file.originalname));
            });
        },

    }),
};