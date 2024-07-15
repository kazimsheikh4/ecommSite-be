const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModal");
//const ProductLib = require("../lib/productLib");

//@desc Get  all categories
//@route GET /api/category
//@access private
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

//@desc  add a category
//@route POST /api/category
//@access public
const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    res.sendStatus(400);
    throw new Error("Name field is mandatory!");
  }
  const category = await Category.create({
    name,
    description,
  });
  res.status(201).json(category);
});

//@desc  get category
//@route PUT /api/category/:id
//@access public
const getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
    });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.Error || "invalid category Id" });
  }
});

//@desc  update a category
//@route PUT /api/category/:id
//@access public
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: categoryId },
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedCategory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc  Delete a product
//@route Delete /api/products/:id
//@access public
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  console.log("opt",category);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await Category.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "category deleted successfully",category });
});

module.exports = {
  getCategories,
  getCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
