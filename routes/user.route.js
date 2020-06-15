const multer = require("multer");
const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

const upload = multer({ dest: "./public/uploads/" });

router.get("/", controller.index);
router.post("/add", upload.single("avatar"), controller.store);
router.get("/delete/:id", controller.destroy);
router.post("/edit/:id", controller.update);

module.exports = router;
