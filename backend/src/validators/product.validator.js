const validateCatalogPayload = (payload, options = {}) => {
	const { requireStock = true, partial = false } = options;
	const errors = [];

	if (!partial || Object.prototype.hasOwnProperty.call(payload, "title")) {
		if (!payload.title || payload.title.trim().length < 2) {
			errors.push("Title must be at least 2 characters");
		}
	}

	if (!partial || Object.prototype.hasOwnProperty.call(payload, "category")) {
		if (!payload.category || payload.category.trim().length < 2) {
			errors.push("Category is required");
		}
	}

	if (!partial || Object.prototype.hasOwnProperty.call(payload, "price")) {
		if (typeof payload.price !== "number" || payload.price < 0) {
			errors.push("Price must be a non-negative number");
		}
	}

	if (requireStock && (!partial || Object.prototype.hasOwnProperty.call(payload, "stock"))) {
		if (!Number.isInteger(payload.stock) || payload.stock < 0) {
			errors.push("Stock must be a non-negative integer");
		}
	}

	return errors;
};

module.exports = {
	validateCatalogPayload,
};
