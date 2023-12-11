const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/product"); // Import your Product model here
const ProductRating = require("../models/product_rating"); // Import your ProductRating model here
const Order = require("../models/order");
const CartItem = require("../models/cart_items");

const ProductImage = require('../models/product_image'); // Import the ProductImage model

exports.createProduct = asyncHandler(async (req, res, next) => {
  try {
    const { name, desc, category_id, price } = req.body;

    const product = await Product.create({
      name,
      desc,
      category_id,
      price,
    });

    if (req.file) {
      const productImage = await ProductImage.create({
        imagePath: req.file.path,
        productId: product.id
      });
    }

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error(error);
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
    // Fetch all products
    const products = await Product.findAll();

    if (!products) {
      return res.status(404).json({
        success: false,
        error: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

exports.rateProduct = asyncHandler(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.params.userid; // Assuming you have user authentication

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
exports.addToCart = asyncHandler(async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.params.userid; // Assuming you have user authentication

    // Check if the user has an open order
    let order = await Order.findOne({
      where: {
        userId,
        state: 'open', // Assuming you have a state field for orders
      },
    });

    // If no open order exists, create one
    if (!order) {
      order = await Order.create({
        userId,
        state: 'open',
      });
    }

    // Now, you have the order (either existing or newly created)
    const orderId = order.id;

    // Create a new cart item with a default quantity of 0
    const [cartItem, created] = await CartItem.findOrCreate({
      where: {
        userId,
        productId,
      },
      defaults: {
        userId,
        productId,
        quantity: 0,
      },
    });

    // Log the values for debugging
    console.log('created:', created);
    console.log('cartItem:', cartItem);

    // Ensure that cartItem is an instance of the Sequelize model
    if (cartItem instanceof CartItem) {
      // Now, you have the cart item with a valid quantity
      cartItem.quantity += quantity;
      await cartItem.save();

      res.status(200).json({
        success: true,
        message: "Product added to the cart successfully",
      });
    } else {
      // Handle the case where cartItem is not an instance of the model
      throw new Error("Failed to create or find cart item");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
