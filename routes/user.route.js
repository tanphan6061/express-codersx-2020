const cloudinary = require("../helper/cloudinary");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const storage = cloudinary('avatar');
const upload = multer({ storage });

router.get("/", csrfProtection, controller.index);
router.post("/add", upload.single("avatar"), csrfProtection, controller.store);
router.get("/delete/:id", controller.destroy);
router.post("/edit/:id", upload.single("avatar"), csrfProtection, controller.update);

module.exports = router;
