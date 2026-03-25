const ProductService = require("../services/product.service");
const { sendSuccess } = require("../utils/response");
const { uploadImageBuffer } = require("../utils/cloudinary");
const { validateCatalogPayload } = require("../validators/product.validator");

const ENTITY = "service";

const createService = async (req, res, next) => {
  try {
    if (req.body.price !== undefined) {
      req.body.price = Number(req.body.price);
    }
    if (req.body.durationMinutes !== undefined) {
      req.body.durationMinutes = Number(req.body.durationMinutes);
    }

    const errors = validateCatalogPayload(req.body, { requireStock: false });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const payload = { ...req.body };
    if (req.file) {
      const uploaded = await uploadImageBuffer(req.file.buffer, "globexpert/services");
      payload.imageUrl = uploaded.secure_url;
    }

    const service = await ProductService.createEntity(ENTITY, payload, req.user);
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
    if (req.body.price !== undefined) {
      req.body.price = Number(req.body.price);
    }
    if (req.body.durationMinutes !== undefined) {
      req.body.durationMinutes = Number(req.body.durationMinutes);
    }

    const errors = validateCatalogPayload(req.body, { requireStock: false, partial: true });
    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: "Validation failed", errors });
    }

    const payload = { ...req.body };
    if (req.file) {
      const uploaded = await uploadImageBuffer(req.file.buffer, "globexpert/services");
      payload.imageUrl = uploaded.secure_url;
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
