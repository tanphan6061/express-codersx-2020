const cloudinary = require("../helper/cloudinary");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/book.controller");

const storage = cloudinary('book-cover');
const upload = multer({ storage });

router.get("/", controller.index);
router.post("/add", upload.single("bookCover"), controller.store);
router.get("/delete/:id", controller.destroy);
router.post("/edit/:id", upload.single("bookCover"), controller.update);

module.exports = router;
