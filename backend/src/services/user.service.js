const User = require("../models/User");
const bcrypt = require("bcrypt");

const listUsers = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.role) {
    filter.role = query.role;
  }
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.isActive === "true" || query.isActive === "false") {
    filter.isActive = query.isActive === "true";
  }

  const [items, total] = await Promise.all([
    User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  return {
    items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateUserStatus = async (userId, body) => {
  if (typeof body.isActive !== "boolean") {
    const error = new Error("isActive boolean is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: body.isActive },
    { new: true }
  ).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const createUserByAdmin = async (body) => {
  const role = body.role || "USER";

  if (role !== "USER") {
    const error = new Error("Admin user creation supports USER role only");
    error.statusCode = 400;
    throw error;
  }

  const email = String(body.email || "").toLowerCase().trim();
  const name = String(body.name || "").trim();
  const password = String(body.password || "");

  if (name.length < 2) {
    const error = new Error("Name must be at least 2 characters");
    error.statusCode = 400;
    throw error;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    const error = new Error("Valid email is required");
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters");
    error.statusCode = 400;
    throw error;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: passwordHash,
    phone: body.phone || "",
    address: body.address || "",
    role: "USER",
    isActive: body.isActive === undefined ? true : Boolean(body.isActive),
  });

  return User.findById(user._id).select("-password");
};

module.exports = {
  listUsers,
  getUserById,
  updateUserStatus,
  createUserByAdmin,
};
