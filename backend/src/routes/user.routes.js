const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), userController.createUserByAdmin);
router.get("/", authenticate, authorize("ADMIN"), userController.listUsers);
router.get("/:id", authenticate, authorize("ADMIN"), userController.getUserById);
router.patch("/:id/status", authenticate, authorize("ADMIN"), userController.updateUserStatus);

module.exports = router;
