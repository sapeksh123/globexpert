const express = require("express");
const serviceController = require("../controllers/service.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/role.middleware");
const { upload } = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", serviceController.listServices);
router.get("/:id", serviceController.getServiceById);
router.post(
  "/",
  authenticate,
  authorize("SELLER", "ADMIN"),
  upload.single("image"),
  serviceController.createService
);
router.put(
  "/:id",
  authenticate,
  authorize("SELLER", "ADMIN"),
  upload.single("image"),
  serviceController.updateService
);
router.delete("/:id", authenticate, authorize("SELLER", "ADMIN"), serviceController.deleteService);

module.exports = router;
