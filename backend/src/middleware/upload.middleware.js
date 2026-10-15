const multer = require("multer");

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: MAX_IMAGE_SIZE_BYTES },
	fileFilter: (_req, file, cb) => {
		if (!file.mimetype || !file.mimetype.startsWith("image/")) {
			const error = new Error("Only image files are allowed");
			error.statusCode = 400;
			cb(error);
			return;
		}
		cb(null, true);
	},
});

module.exports = { upload };
