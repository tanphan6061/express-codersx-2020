const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SCRET
});

// const storage = new CloudinaryStorage({
//     cloudinary,
//     params: {
//         folder: "app",
//         allowedFormats: ["jpg", "jpeg", "png", "WEBP", "png"],
//         transformation: [{ width: 400, height: 400, crop: "limit" }],
//         // filename: (req, file) => file.originalname
//     }
// });

// module.exports = storage;

module.exports = function (folderName) {
    return new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "book-managements/" + folderName,
            allowedFormats: ["jpg", "jpeg", "png", "WEBP", "png"],
            transformation: [{ width: 400, height: 400, crop: "limit" }],
            // filename: (req, file) => file.originalname
        }
    });
}