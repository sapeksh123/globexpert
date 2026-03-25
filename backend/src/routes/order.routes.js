const express = require("express");
const orderController = require("../controllers/order.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", authenticate, orderController.listOrders);
router.get("/:id", authenticate, orderController.getOrderById);
router.post("/", authenticate, authorize("USER", "ADMIN"), orderController.createOrder);
router.patch(
	"/:id/status",
	authenticate,
	authorize("SELLER", "ADMIN"),
	orderController.updateOrderStatus
);

module.exports = router;
