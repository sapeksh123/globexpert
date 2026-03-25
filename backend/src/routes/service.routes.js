const express = require("express");
const multer = require("multer");
const serviceController = require("../controllers/service.controller");
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
