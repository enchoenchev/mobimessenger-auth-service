const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const userController = require("../controllers/user");

router.post("/register", authController.register);
router.post("/login", authController.login);

// Protect the routes below
router.use(authController.guard);

router.get("/users", userController.all);

module.exports = router;
