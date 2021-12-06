const multer = require("multer");
const cloudinary = require("cloudinary").v2;
require('dotenv').config();

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const {
    CLOUDINARY_HOST,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_HOST,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Fantasy Forecast Profile Pictures",
        format: async () => "png",
        public_id: (req, file) => req.params.username
    },
});

const parser = multer({ storage: storage });

module.exports = parser;