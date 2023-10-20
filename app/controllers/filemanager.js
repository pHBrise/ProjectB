const multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10000000 }, // 10 MB limit
});

module.exports.uploadProfileImage =  upload.single('image');
