const express = require("express");
const healthController = require("../controllers/health.controller");

const router = express.Router();

router.get("/", healthController.check);
router.get("/live", healthController.liveness);
router.get("/ready", healthController.readiness);

module.exports = router;
