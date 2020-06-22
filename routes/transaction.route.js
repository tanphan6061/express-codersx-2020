const express = require("express");
const router = express.Router();
const controller = require("../controllers/transaction.controller");
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

router.get("/", controller.index);
router.get("/create", csrfProtection, controller.create);
router.post("/create", csrfProtection, controller.store);
router.get("/:id/complete", controller.update);
router.get('/rent', controller.rentBook);

module.exports = router;
