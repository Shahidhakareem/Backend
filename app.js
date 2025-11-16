require("dotenv").config(); // loads .env locally
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Import your routes
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");
const courseRoutes = require("./api/routes/courses");

const app = express();

// --- Middlewares ---
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost")) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/courses", courseRoutes);

// --- Test route ---
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// --- Error Handling ---
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: { message: error.message },
  });
});

// --- MongoDB connection ---
const mongoURL = process.env.MONGO_URL; // set in Render dashboard
if (!mongoURL) {
  console.error("❌ MONGO_URL is not defined!");
} else {
  mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
}

module.exports = app;
