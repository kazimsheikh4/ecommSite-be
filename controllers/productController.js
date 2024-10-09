const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const ProductLib = require("../lib/productLib");
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
  const { category_id, name, size, price, type } = req.body;
  if (!name || !size || !price) {
    res.sendStatus(400);
    throw new Error("All fields are mandatory!");
  }
  const product = await Product.create({
    category_id,
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
  try {
    const product = await ProductLib.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.Error || "invalid product Id" });
  }
});

//@desc  update a product
//@route PUT /api/products/:id
//@access public
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const updatedProduct = await ProductLib.findOneAndUpdate(
      { _id: productId, user_id: userId },
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

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

const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const userId = req.user.id;
    const products = await Product.find({ category_id: categoryId });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }
    const productsWithoutUserId = products.map((product) => {
      const { user_id, category_id, ...productWithoutUserId } =
        product.toObject();
      return productWithoutUserId;
    });

    return res
      .status(200)
      .json({
        user_id: userId,
        category_id: categoryId,
        products: productsWithoutUserId,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};
