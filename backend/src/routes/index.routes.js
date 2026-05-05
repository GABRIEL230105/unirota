const express = require("express");
const userController = require("../controllers/User");
const protect = require("../middleware/auth");

const router = express.Router();

router.post("/", userController.create);
router.post("/login", userController.login);

// 🔥 ROTAS DE RECUPERAÇÃO
router.post("/recuperar-senha", userController.forgotPassword);
router.post("/resetar-senha", userController.resetPassword); // 👈 FALTAVA ESSA

// ROTAS PROTEGIDAS
router.get("/profile", protect, userController.profile);
router.put("/profile", protect, userController.update);

module.exports = router;