const asyncHandler = require("../middleware/asyncHandler");
const ProductCategory = require("../models/product_category");

exports.createCategory = asyncHandler(async (req, res, next) => {
  try {
    // Extract category data from the request body
    const { name, description } = req.body;

    // Create a new category
    const category = await ProductCategory.create({
      name,
      description,
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    // Find and delete the category
    const category = await ProductCategory.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.editCategory = asyncHandler(async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    // Find and update the category
    const category = await ProductCategory.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    category.name = name;
    category.description = description;
    await category.save();

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.viewCategory = asyncHandler(async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    // Find the category by ID
    const category = await ProductCategory.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.viewAllCategories = asyncHandler(async (req, res, next) => {
  try {
    // Find all categories
    const categories = await ProductCategory.findAll();

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
