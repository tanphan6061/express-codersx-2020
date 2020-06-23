const express = require("express");
const router = express.Router();
const authController = require("../controllers/Api/auth.controller");
const transactionController = require("../controllers/Api/transaction.controller");

router.post("/login", authController.postLogin);
router.get("/transactions", transactionController.index);

module.exports = router;
