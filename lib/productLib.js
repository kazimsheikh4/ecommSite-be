const Product = require("../models/productModel");

const findOne = async (options) => {
  const product = await Product.findOne(options);

  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};
const findOneAndUpdate = async (query, update, options) => {
  const updatedProduct = await Product.findOneAndUpdate(query, update, options);
  if (!updatedProduct) {
    throw new Error(
      "Product not found or user does not have permission to update it"
    );
  }
  return updatedProduct;
};
module.exports = {
  findOne,
  findOneAndUpdate,
};
