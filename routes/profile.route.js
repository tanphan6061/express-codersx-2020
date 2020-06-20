const cloudinary = require("../helper/cloudinary");
const multer = require("multer");
const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');

const storage = cloudinary('avatar');
const upload = multer({ storage });

router.get('/', controller.index);
router.get('/avatar', controller.edit);
router.post('/avatar', upload.single("avatar"), controller.update);
module.exports = router;