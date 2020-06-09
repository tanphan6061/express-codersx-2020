const express = require("express");
const router = express.Router();
const controller = require("../controllers/book.controller");

router.get("/", controller.index);
router.post("/add", controller.store);
router.get("/delete/:id", controller.destroy);
router.post("/edit/:id", controller.update);

module.exports = router;
