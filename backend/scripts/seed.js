const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const connectDB = require("../src/config/db");
const User = require("../src/models/User");
const Seller = require("../src/models/Seller");
const Product = require("../src/models/Product");
const Service = require("../src/models/Service");

dotenv.config({ path: require("path").resolve(__dirname, "..", ".env") });

async function run() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Seller.deleteMany({}),
    Product.deleteMany({}),
    Service.deleteMany({}),
  ]);

  const password = await bcrypt.hash("password123", 10);

  const [admin, sellerUser, customer] = await User.create([
    {
      name: "Platform Admin",
      email: "admin@globexpert.com",
      password,
      role: "ADMIN",
      isActive: true,
    },
    {
      name: "Approved Seller",
      email: "seller@globexpert.com",
      password,
      role: "SELLER",
      isActive: true,
    },
    {
      name: "Sample Customers",
      email: "user@globexpert.com",
      password,
      role: "USER",
      isActive: true,
    },
  ]);

  await Seller.create({
    user: sellerUser._id,
    businessName: "Seller Hub",
    businessDescription: "Demo seller profile",
    status: "APPROVED",
  });

  await Product.create([
    {
      seller: sellerUser._id,
      title: "Bluetooth Speaker",
      description: "Portable speaker with deep bass",
      category: "Electronics",
      price: 59,
      stock: 30,
      isActive: true,
    },
    {
      seller: sellerUser._id,
      title: "Water Purifier",
      description: "Home purifier with 5-stage filtration",
      category: "Home",
      price: 129,
      stock: 12,
      isActive: true,
    },
  ]);

  await Service.create([
    {
      seller: sellerUser._id,
      title: "AC Servicing",
      description: "Deep clean and gas check",
      category: "Home Care",
      price: 39,
      durationMinutes: 60,
      isActive: true,
    },
    {
      seller: sellerUser._id,
      title: "Hair Styling",
      description: "Salon-level styling at home",
      category: "Beauty",
      price: 25,
      durationMinutes: 45,
      isActive: true,
    },
  ]);

  console.log("Seed completed");
  console.log("Admin:", admin.email, "password123");
  console.log("Seller:", sellerUser.email, "password123");
  console.log("User:", customer.email, "password123");
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
