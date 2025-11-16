

const Product = require("../models/product");
const mongoose = require("mongoose");

exports.products_get_all =  (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3001/products/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
}
exports.products_create_product = (req, res, next) =>{
   const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
    });
    product
      .save()
      .then((result) => {
        console.log(result);
        res.status(201).json({
          message: "Created product successfully",
          createdProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + result._id,
            },
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
}

exports.products_get_product = (req, res, next) => {
   const id = req.params.productId;
    Product.findById(id)
      .select("name price _id productImage")
      .exec()
      .then((doc) => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            product: doc,
            request: {
              type: "GET",
              url: "http://localhost:3001/products",
            },
          });
        } else {
          res
            .status(404)
            .json({ message: " No valid entry found for provided ID" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
}
exports.products_updates_product = (req, res, next)=>{
  const id = req.params.productId;
  
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
  
    try {
      const updated =  Product.findByIdAndUpdate(
        id,
        { $set: updateOps },
        { new: true } // return updated document
      ).exec();
  
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json({
        message: "Product updated",
        updatedProduct: updated,
        request: {
          type: "GET",
          url: "http://localhost:3001/products/" + id,
        },
      });
    } catch (err) {
      console.error("PATCH /products/:id error:", err);
      res.status(500).json({ error: err });
    }
}
exports.products_delete_product = (req, res, next)=>{
   const id = req.params.productId;
  try {
    const deleted =  Product.findByIdAndDelete(id).exec();
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct: deleted,
      request: {
        type: "POST",
        url: "http://localhost:3001/products/",
        body: { name: "String", price: "Number" },
      },
    });
  } catch (err) {
    console.error("DELETE /products/:id error:", err);
    res.status(500).json({ error: err });
  }
}
