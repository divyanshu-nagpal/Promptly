const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // Correct import

// Use Cloudinary storage configuration

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'prompt_images', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'], // Supported image formats
  },
});

const upload = multer({ storage });

module.exports = upload;
