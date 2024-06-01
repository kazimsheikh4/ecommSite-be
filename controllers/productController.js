const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

//@desc Get  all products
//@route GET /api/products
//@access public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user_id: req.user.id });
  res.status(200).json(products);
});

//@desc  add a product
//@route POST /api/products
//@access public
const addProduct = asyncHandler(async (req, res) => {
  console.log("req is:", req.body);
  const { name, size, price, type } = req.body;
  if (!name || !size || !price) {
    res.sendStatus(400);
    throw new Error("All fields are mandatory!");
  }
  const product = await Product.create({
    name,
    price,
    size,
    type,
    user_id: req.user.id,
  });
  res.status(201).json(product);
});

//@desc  add a product
//@route POST /api/products/:id
//@access public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  console.log("product", product, product.user_id.toString(), req.user.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User dont have permission to update this product");
  }
  res.status(200).json(product);
});

//@desc  update a product
//@route PUT /api/products/:id
//@access public
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User dont have permission to update this product");
  }

  const updatedContact = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedContact);
});

//@desc  Delete a product
//@route Delete /api/products/:id
//@access public
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to update this product");
  }

  await Product.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Product deleted successfully" });
});

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
