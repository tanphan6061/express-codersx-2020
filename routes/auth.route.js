const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
const csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

router.get("/login", csrfProtection, controller.login);
router.post("/login", csrfProtection, controller.postLogin);
router.get('/logout', controller.logout);

module.exports = router;
