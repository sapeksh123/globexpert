const ProductService = require("../services/product.service");
const { sendSuccess } = require("../utils/response");
const { validateCatalogPayload } = require("../validators/product.validator");

const ENTITY = "service";

const createService = async (req, res, next) => {
  try {
    const errors = validateCatalogPayload(req.body, { requireStock: false });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const payload = { ...req.body };
    if (req.file) {
      payload.imageUrl = `/uploads/${req.file.filename}`;
    }

    const service = await ProductService.createEntity(ENTITY, payload, req.user._id);
    return sendSuccess(res, 201, "Service created", service);
  } catch (error) {
    next(error);
  }
};

const listServices = async (req, res, next) => {
  try {
    const result = await ProductService.listEntities(ENTITY, req.query);
    return sendSuccess(res, 200, "Services fetched", result.items, result.meta);
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await ProductService.getEntityById(ENTITY, req.params.id);
    return sendSuccess(res, 200, "Service fetched", service);
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const errors = validateCatalogPayload(req.body, { requireStock: false, partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const payload = { ...req.body };
    if (req.file) {
      payload.imageUrl = `/uploads/${req.file.filename}`;
    }

    const service = await ProductService.updateEntity(
      ENTITY,
      req.params.id,
      payload,
      req.user
    );

    return sendSuccess(res, 200, "Service updated", service);
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    await ProductService.deleteEntity(ENTITY, req.params.id, req.user);
    return sendSuccess(res, 200, "Service deleted", null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createService,
  listServices,
  getServiceById,
  updateService,
  deleteService,
};
