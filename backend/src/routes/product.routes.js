const express = require("express");
const multer = require("multer");
const productController = require("../controllers/product.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

const storage = multer.diskStorage({
	destination: "uploads/",
	filename: (_req, file, cb) => {
		const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
		cb(null, safeName);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
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
