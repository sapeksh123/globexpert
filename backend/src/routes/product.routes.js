const express = require("express");
const multer = require("multer");
const productController = require("../controllers/product.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		if (!file.mimetype || !file.mimetype.startsWith("image/")) {
			cb(new Error("Only image files are allowed"));
			return;
		}
		cb(null, true);
	},
});

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
