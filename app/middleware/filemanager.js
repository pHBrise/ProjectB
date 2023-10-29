const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'projectb-402608',
  keyFilename: 'projectb-keyfile.json'
})

const bucketName = "ggcsbucket";
const bucket = storage.bucket(bucketName);

const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

const uploadSingle = multer(multerConfig).single('image')

const uploadMultiple = multer(multerConfig).array('images', 5);

module.exports.singleFileUpload = async (req, res, next) => {

  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ messae: err.message })
    }
    if (req.file) {
      const blobStream = bucket.file(req.user._id + '/' + req.file.originalname).createWriteStream();
      blobStream.on('error', (err) => {
        res.status(400).send(err.message);
      });

      blobStream.on('finish', () => {
        console.log(blobStream)
        next()
      });
      blobStream.end(req.file.buffer);
    } else {
      return res.status(400).send('Upload failed.');
    }
  })
}

module.exports.multipleFileUpload = async (req, res, next) => {
  uploadMultiple(req, res, async (err) => {
    if (err) {
      return res.status(400).send('Upload failed.');
    }
    if (req.files) {
      const uploadPromises = req.files.map(async (file) => {
        const fileName = file.originalname;
        const fileUpload = bucket.file(fileName);
        const blobStream = fileUpload.createWriteStream();
  
        blobStream.on('error', (error) => {
          console.error(error);
        });
  
        blobStream.on('finish', () => {
          console.log(`Uploaded: ${fileName}`);
        });
  
        blobStream.end(file.buffer);
      });
      await Promise.all(uploadPromises);
      res.status(200).send('Files uploaded successfully.');
    } else {
      next()
    }
  });
}

module.exports.getProfileImage = async (req, res) => {
  const userId = req.params.userId;
  const imageName = req.params.image;
  const filePath = `${userId}/${imageName}`;
  const file = bucket.file(filePath);
  console.log(filePath)
  const stream = file.createReadStream();
  stream.on('error', () => {
    res.status(404).send('File not found');
  });
  stream.pipe(res);
}