const cloudinary = require("../helper/cloudinary");
const multer = require("multer");
const express = require('express');
const router = express.Router();
const controller = require('../controllers/profile.controller');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const storage = cloudinary('avatar');
const upload = multer({ storage });

router.get('/', controller.index);
router.get('/avatar', csrfProtection, controller.edit);
router.post('/avatar', upload.single("avatar"), csrfProtection, controller.update);
module.exports = router;