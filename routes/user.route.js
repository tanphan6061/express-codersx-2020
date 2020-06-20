const cloudinary = require("../helper/cloudinary");
const multer = require("multer");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

const storage = cloudinary('avatar');
const upload = multer({ storage });

router.get("/", controller.index);
router.post("/add", upload.single("avatar"), controller.store);
router.get("/delete/:id", controller.destroy);
router.post("/edit/:id", upload.single("avatar"), controller.update);

module.exports = router;
