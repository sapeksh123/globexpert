const express = require("express");
const sellerController = require("../controllers/seller.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");

const router = express.Router();

router.post("/request", authenticate, authorize("USER"), sellerController.createSellerRequest);
router.post("/admin-create", authenticate, authorize("ADMIN"), sellerController.createSellerByAdmin);
router.get("/me", authenticate, authorize("SELLER", "ADMIN"), sellerController.getMySellerProfile);
router.get("/", authenticate, authorize("ADMIN"), sellerController.listSellers);
router.patch("/:id/status", authenticate, authorize("ADMIN"), sellerController.updateSellerStatus);

module.exports = router;
