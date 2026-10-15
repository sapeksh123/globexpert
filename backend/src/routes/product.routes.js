const express = require("express");
const productController = require("../controllers/product.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { upload } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", productController.listProducts);
router.get("/:id", productController.getProductById);
router.post(
	"/",
	authenticate,
	authorize("SELLER", "ADMIN"),
	upload.single("image"),
	productController.createProduct
);
router.put(
	"/:id",
	authenticate,
	authorize("SELLER", "ADMIN"),
	upload.single("image"),
	productController.updateProduct
);
router.delete("/:id", authenticate, authorize("SELLER", "ADMIN"), productController.deleteProduct);

module.exports = router;
