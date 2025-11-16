const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const checkAuth = require("../middleware/check-auth");

const ProductsController = require("../controllers/products");

const uploadPath = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get("/", checkAuth, ProductsController.products_get_all);

router.post( "/", checkAuth, upload.single("productImage"),  ProductsController.products_create_product);

router.get("/:productId", checkAuth, ProductsController.products_get_product);

router.patch("/:productId", checkAuth, ProductsController.products_updates_product);

router.delete("/:productId", checkAuth, ProductsController.products_delete_product);



module.exports = router;
