const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const courseRoutes = require("./api/routes/courses");

const path = require("path");

const app = express();
const PORT = process.env.PORT || 3002;

// --- MongoDB connection ---
mongoose
  .connect(
    `mongodb+srv://node-shop:${process.env.MONGO_ATLAS_PW}@node-rest-shop.pirjpb5.mongodb.net/node-shop?retryWrites=true&w=majority`
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// --- Middlewares ---
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// --- Routes ---
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/courses", courseRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Test route ---
app.post("/user/signup", (req, res) => {
  res.send("Signup route works");
});

// --- Static folder ---
app.use("/uploads", express.static("uploads"));

// --- Error Handling ---
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

module.exports = app;
