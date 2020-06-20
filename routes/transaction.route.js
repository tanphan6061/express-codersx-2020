const express = require("express");
const router = express.Router();
const controller = require("../controllers/transaction.controller");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.store);
router.get("/:id/complete", controller.update);
router.get('/rent', controller.rentBook);

module.exports = router;
