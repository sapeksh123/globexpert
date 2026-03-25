const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = require("../src/app");
const connectDB = require("../src/config/db");

const randomSuffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
const userEmail = `smoke.user.${randomSuffix}@globexpert.test`;
const sellerEmail = `smoke.seller.${randomSuffix}@globexpert.test`;
const password = "password123";

const assertStatus = async (res, expected, label) => {
  if (res.status !== expected) {
    const body = await res.text();
    throw new Error(`${label} failed: expected ${expected}, got ${res.status}. Body: ${body}`);
  }
};

const run = async () => {
  await connectDB();

  const server = app.listen(0);
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  try {
    const health = await fetch(`${base}/`);
    await assertStatus(health, 200, "health");

    const registerUser = await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Smoke User", email: userEmail, password }),
    });
    await assertStatus(registerUser, 201, "register user");

    const loginUser = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, password }),
    });
    await assertStatus(loginUser, 200, "login user");
    const loginUserJson = await loginUser.json();
    const userToken = loginUserJson?.data?.token;

    const me = await fetch(`${base}/api/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    await assertStatus(me, 200, "auth me");

    const products = await fetch(`${base}/api/products`);
    await assertStatus(products, 200, "list products");

    const services = await fetch(`${base}/api/services`);
    await assertStatus(services, 200, "list services");

    const createOrderNoItems = await fetch(`${base}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({ deliveryAddress: "Smoke Address", items: [] }),
    });
    await assertStatus(createOrderNoItems, 400, "order validation");

    const userToAdminRoute = await fetch(`${base}/api/users`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    await assertStatus(userToAdminRoute, 403, "rbac users forbidden");

    const registerSeller = await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Smoke Seller",
        email: sellerEmail,
        password,
        role: "SELLER",
        businessName: "Smoke Store",
      }),
    });
    await assertStatus(registerSeller, 201, "register seller");

    const loginSeller = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: sellerEmail, password }),
    });
    await assertStatus(loginSeller, 200, "login seller");
    const loginSellerJson = await loginSeller.json();
    const sellerToken = loginSellerJson?.data?.token;

    const createProductPendingSeller = await fetch(`${base}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sellerToken}`,
      },
      body: JSON.stringify({ title: "Smoke Product", category: "Smoke", price: 10, stock: 2 }),
    });
    await assertStatus(createProductPendingSeller, 403, "seller approval guard");

    console.log("SMOKE_CHECK_PASS");
    console.log(`User: ${userEmail}`);
    console.log(`Seller: ${sellerEmail}`);
  } finally {
    server.close();
  }
};

run().catch((error) => {
  console.error("SMOKE_CHECK_FAIL");
  console.error(error.message);
  process.exit(1);
});
