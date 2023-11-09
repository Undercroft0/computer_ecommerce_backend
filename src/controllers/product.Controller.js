const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/product"); // Import your Product model here
const ProductRating = require("../models/product_rating"); // Import your ProductRating model here

exports.createProduct = asyncHandler(async (req, res, next) => {
  try {
    // Extract product data from the request body
    const { name, desc, category_id, price } = req.body;

    // Create a new product
    const product = await Product.create({
      name,
      desc,
      category_id,
      price,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    const productId = req.params.id;

    // Find and delete the product
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.editProduct = asyncHandler(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { name, desc, category_id, price } = req.body;

    // Find and update the product
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    product.name = name;
    product.desc = desc;
    product.category_id = category_id;
    product.price = price;
    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.viewProduct = asyncHandler(async (req, res, next) => {
  try {
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  try {

    const products = await Product.findAll({
      attributes: ['name', 'price']
    });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

exports.rateProduct = asyncHandler(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.userid; // Assuming you have user authentication

    const { rating } = req.body;

    // Create or update a product rating by the user
    let productRating = await ProductRating.findOne({
      where: {
        productId,
        userId,
      },
    });

    if (!productRating) {
      productRating = await ProductRating.create({
        productId,
        userId,
        rating,
      });
    } else {
      productRating.rating = rating;
      await productRating.save();
    }

    // Calculate the average rating for the product
    const averageRating = await ProductRating.average("rating", {
      where: { productId },
    });

    res.status(200).json({
      success: true,
      data: {
        averageRating,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
