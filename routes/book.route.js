const cloudinary = require("../helper/cloudinary");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/book.controller");
const csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

const storage = cloudinary('book-cover');
const upload = multer({ storage });

router.get("/", csrfProtection, controller.index);
router.post("/add", upload.single("bookCover"), csrfProtection, controller.store);
router.get("/delete/:id", controller.destroy);
router.post("/edit/:id", upload.single("bookCover"), csrfProtection, controller.update);

module.exports = router;
