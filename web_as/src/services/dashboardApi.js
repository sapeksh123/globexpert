import apiClient from "./apiClient";

const toIsoDate = (date) => new Date(date).toISOString().slice(0, 10);

const inRange = (dateIso, fromDate, toDate) => {
  if (fromDate && dateIso < fromDate) return false;
  if (toDate && dateIso > toDate) return false;
  return true;
};

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

export async function fetchSellerDashboardAnalytics({ userId, status = "", fromDate = "", toDate = "" }) {
  const [productsMeta, servicesMeta] = await Promise.all([
    apiClient.get(`/products?limit=1${userId ? `&sellerId=${userId}` : ""}`),
    apiClient.get(`/services?limit=1${userId ? `&sellerId=${userId}` : ""}`),
  ]);

  const firstPage = await apiClient.get(`/orders?page=1&limit=100${status ? `&status=${status}` : ""}`);
  const firstRows = firstPage.data?.data ?? [];
  const totalPages = Number(firstPage.data?.meta?.totalPages || 1);

  const remaining = [];
  for (let page = 2; page <= totalPages; page += 1) {
    remaining.push(apiClient.get(`/orders?page=${page}&limit=100${status ? `&status=${status}` : ""}`));
  }

  const restPages = remaining.length ? await Promise.all(remaining) : [];
  const allOrders = [
    ...firstRows,
    ...restPages.flatMap((response) => response.data?.data ?? []),
  ];

  const filteredOrders = allOrders.filter((row) => {
    const dateIso = toIsoDate(row.createdAt);
    return inRange(dateIso, fromDate, toDate);
  });

  const revenue = filteredOrders.reduce((sum, row) => sum + Number(row.subtotal || 0), 0);

  const statusMap = {
    CONFIRMED: 0,
    PROCESSING: 0,
    DELIVERED: 0,
  };

  filteredOrders.forEach((row) => {
    if (statusMap[row.status] !== undefined) {
      statusMap[row.status] += 1;
    }
  });

  const byDayMap = new Map();
  filteredOrders.forEach((row) => {
    const day = toIsoDate(row.createdAt);
    const current = byDayMap.get(day) || { date: day, orders: 0, revenue: 0 };
    current.orders += 1;
    current.revenue += Number(row.subtotal || 0);
    byDayMap.set(day, current);
  });

  const byDay = Array.from(byDayMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-10);

  return {
    kpis: {
      totalOrders: filteredOrders.length,
      totalRevenue: revenue,
      totalProducts: productsMeta.data?.meta?.total ?? 0,
      totalServices: servicesMeta.data?.meta?.total ?? 0,
    },
    statusBreakdown: statusMap,
    trendByDay: byDay,
  };
}

export async function fetchCatalogRows({ search = "", page = 1, limit = 20, status = "", category = "" }) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) {
    query.set("search", search.trim());
  }
  if (status) {
    query.set("isActive", status === "Active" ? "true" : "false");
  }
  if (category.trim()) {
    query.set("category", category.trim());
  }

  const [products, services] = await Promise.all([
    apiClient.get(`/products?${query.toString()}`),
    apiClient.get(`/services?${query.toString()}`),
  ]);

  const productRows = (products.data?.data ?? []).map((item) => ({
    id: item._id,
    title: item.title,
    description: item.description ?? "",
    type: "PRODUCT",
    category: item.category,
    priceValue: Number(item.price || 0),
    price: `Rs. ${Number(item.price || 0).toFixed(2)}`,
    stockValue: Number(item.stock || 0),
    durationMinutes: 0,
    imageUrl: item.imageUrl || "",
    isActive: Boolean(item.isActive),
    status: item.isActive ? "Active" : "Inactive",
  }));

  const serviceRows = (services.data?.data ?? []).map((item) => ({
    id: item._id,
    title: item.title,
    description: item.description ?? "",
    type: "SERVICE",
    category: item.category,
    priceValue: Number(item.price || 0),
    price: `Rs. ${Number(item.price || 0).toFixed(2)}`,
    stockValue: 0,
    durationMinutes: Number(item.durationMinutes || 30),
    imageUrl: item.imageUrl || "",
    isActive: Boolean(item.isActive),
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
    amount: `Rs. ${Number(order.subtotal || 0).toFixed(2)}`,
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

export async function createCatalogItem({ type, title, category, description, price, stock, durationMinutes, isActive }) {
  const payload = new FormData();
  payload.append("title", title);
  payload.append("category", category);
  payload.append("description", description || "");
  payload.append("price", String(Number(price)));
  payload.append("isActive", String(Boolean(isActive)));

  if (type === "PRODUCT") {
    payload.append("stock", String(Number(stock || 0)));
  } else {
    payload.append("durationMinutes", String(Number(durationMinutes || 30)));
  }

  if (arguments[0]?.imageFile) {
    payload.append("image", arguments[0].imageFile);
  }

  if (type === "PRODUCT") {
    await apiClient.post("/products", payload);
    return;
  }

  await apiClient.post("/services", payload);
}

export async function updateCatalogItem({ id, type, title, category, description, price, stock, durationMinutes, isActive }) {
  const payload = new FormData();
  payload.append("title", title);
  payload.append("category", category);
  payload.append("description", description || "");
  payload.append("price", String(Number(price)));
  payload.append("isActive", String(Boolean(isActive)));

  if (type === "PRODUCT") {
    payload.append("stock", String(Number(stock || 0)));
  } else {
    payload.append("durationMinutes", String(Number(durationMinutes || 30)));
  }

  if (arguments[0]?.imageFile) {
    payload.append("image", arguments[0].imageFile);
  }

  if (type === "PRODUCT") {
    await apiClient.put(`/products/${id}`, payload);
    return;
  }

  await apiClient.put(`/services/${id}`, payload);
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
