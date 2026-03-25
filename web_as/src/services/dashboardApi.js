import apiClient from "./apiClient";

export async function fetchDashboardStats(userRole) {
  const [products, services, orders] = await Promise.all([
    apiClient.get("/products?limit=1"),
    apiClient.get("/services?limit=1"),
    apiClient.get("/orders?limit=1"),
  ]);

  let usersMeta = null;
  if (userRole === "ADMIN") {
    const users = await apiClient.get("/users?limit=1");
    usersMeta = users.data?.meta ?? null;
  }

  const productTotal = products.data?.meta?.total ?? 0;
  const serviceTotal = services.data?.meta?.total ?? 0;
  const orderTotal = orders.data?.meta?.total ?? 0;

  return {
    orders: orderTotal,
    catalog: productTotal + serviceTotal,
    users: usersMeta?.total ?? null,
    revenue: 0,
  };
}

export async function fetchCatalogRows({ search = "", page = 1, limit = 10 }) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) {
    query.set("search", search.trim());
  }

  const [products, services] = await Promise.all([
    apiClient.get(`/products?${query.toString()}`),
    apiClient.get(`/services?${query.toString()}`),
  ]);

  const productRows = (products.data?.data ?? []).map((item) => ({
    id: item._id,
    title: item.title,
    type: "PRODUCT",
    category: item.category,
    priceValue: Number(item.price || 0),
    price: `$${Number(item.price || 0).toFixed(2)}`,
    stockValue: Number(item.stock || 0),
    status: item.isActive ? "Active" : "Inactive",
  }));

  const serviceRows = (services.data?.data ?? []).map((item) => ({
    id: item._id,
    title: item.title,
    type: "SERVICE",
    category: item.category,
    priceValue: Number(item.price || 0),
    price: `$${Number(item.price || 0).toFixed(2)}`,
    stockValue: 0,
    status: item.isActive ? "Active" : "Inactive",
  }));

  return {
    rows: [...productRows, ...serviceRows],
    total: (products.data?.meta?.total ?? 0) + (services.data?.meta?.total ?? 0),
  };
}

export async function fetchOrderRows({ status = "", page = 1, limit = 10 }) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) query.set("status", status);

  const response = await apiClient.get(`/orders?${query.toString()}`);
  const rows = (response.data?.data ?? []).map((order) => ({
    id: order._id,
    customer: order.user?.name || "-",
    amount: `$${Number(order.subtotal || 0).toFixed(2)}`,
    status: order.status,
    date: new Date(order.createdAt).toISOString().slice(0, 10),
  }));

  return { rows, total: response.data?.meta?.total ?? 0 };
}

export async function updateOrderStatus(orderId, status) {
  await apiClient.patch(`/orders/${orderId}/status`, { status });
}

export async function fetchUsersRows({ role = "", search = "", page = 1, limit = 10 }) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (role) query.set("role", role);
  if (search.trim()) query.set("search", search.trim());

  const response = await apiClient.get(`/users?${query.toString()}`);
  const rows = (response.data?.data ?? []).map((user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: Boolean(user.isActive),
    active: user.isActive ? "Active" : "Inactive",
  }));

  return { rows, total: response.data?.meta?.total ?? 0 };
}

export async function updateUserStatus(userId, isActive) {
  await apiClient.patch(`/users/${userId}/status`, { isActive });
}

export async function createCatalogItem({ type, title, category, price, stock }) {
  if (type === "PRODUCT") {
    await apiClient.post("/products", {
      title,
      category,
      price: Number(price),
      stock: Number(stock || 0),
      description: "",
    });
    return;
  }

  await apiClient.post("/services", {
    title,
    category,
    price: Number(price),
    durationMinutes: 30,
    description: "",
  });
}

export async function updateCatalogItem({ id, type, title, category, price, stock }) {
  if (type === "PRODUCT") {
    await apiClient.put(`/products/${id}`, {
      title,
      category,
      price: Number(price),
      stock: Number(stock || 0),
    });
    return;
  }

  await apiClient.put(`/services/${id}`, {
    title,
    category,
    price: Number(price),
    durationMinutes: 30,
  });
}

export async function deleteCatalogItem({ type, id }) {
  if (type === "PRODUCT") {
    await apiClient.delete(`/products/${id}`);
    return;
  }
  await apiClient.delete(`/services/${id}`);
}

export async function fetchSellersRows({ status = "", page = 1, limit = 20 }) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) query.set("status", status);

  const response = await apiClient.get(`/sellers?${query.toString()}`);
  const rows = (response.data?.data ?? []).map((seller) => ({
    id: seller._id,
    businessName: seller.businessName,
    owner: seller.user?.name ?? "-",
    email: seller.user?.email ?? "-",
    status: seller.status,
  }));

  return { rows, total: rows.length };
}

export async function updateSellerStatus(sellerId, status) {
  await apiClient.patch(`/sellers/${sellerId}/status`, { status });
}
