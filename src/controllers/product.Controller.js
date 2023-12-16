const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/product"); // Import your Product model here
const ProductRating = require("../models/product_rating"); // Import your ProductRating model here
const ProductSpecificationValue = require("../models/product_spec_values");
const ProductSpecification = require("../models/product_specification");
const Order = require("../models/order");
const CartItem = require("../models/cart_items");
const path = require('path');

const ProductImage = require('../models/product_image'); // Import the ProductImage model

exports.createProduct = asyncHandler(async (req, res, next) => {
  try {
    const { name, desc, category_id, price } = req.body;
    console.log('desc', desc);

    description = desc;
    const product = await Product.create({
      name,
      description,
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

exports.rateProduct = asyncHandler(async (req, res) => {
  const { productId, rating } = req.body;

  // Check if the user is authenticated
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'User not authenticated' });
  }

  const userId = req.user.id;

  try {
    // Check if the user has already rated the product
    const existingRating = await ProductRating.findOne({
      where: { userId, productId },
    });

    if (existingRating) {
      // If the user has already rated, update the rating
      await existingRating.update({ rating });
    } else {
      // If the user has not rated, create a new rating
      await ProductRating.create({ userId, productId, rating });
    }

    // Calculate the average rating for the product and update the product's rating field
    const averageRating = await ProductRating.findOne({
      attributes: [[sequelize.fn('avg', sequelize.col('rating')), 'averageRating']],
      where: { productId },
    });

    // Update the product's rating field
    await Product.update({ rating: averageRating.dataValues.averageRating }, { where: { id: productId } });

    res.status(200).json({ success: true, message: 'Product rated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
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
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.params.userid;

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        { 
          model: Product, 
          attributes: ['id', 'name', 'price'],
          include: [
            { model: ProductImage, as: 'images', attributes: ['imagePath'] } // Use the 'as' keyword here
          ]
        }
      ],
      raw: true,
    });

    console.log('Cart items:', cartItems);

    // Log image paths for debugging
    cartItems.forEach((item) => {
      if (item['product.images'] && item['product.images'].length > 0) {
        console.log(`Image Path for Product ${item['product.id']}:`, item['product.images'][0].imagePath);
      }
    });

    res.status(200).json({
      success: true,
      data: cartItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    }); 
  }
};




exports.updateCartItem = async (req, res, next) => {
  try {
    const { cartItemId, quantity } = req.body;

    // Find the cart item for the specified cartItemId
    const cartItem = await CartItem.findByPk(cartItemId);

    // If the cart item doesn't exist, handle the error
    if (!cartItem) {
      console.error('Cart item not found:', cartItemId);
      return res.status(404).json({
        success: false,
        error: 'Cart item not found',
      });
    }

    // Check if cartItem is an instance of Sequelize's Model
    if (!(cartItem instanceof CartItem)) {
      console.error('Invalid cart item:', cartItem);
      // Handle the case where cartItem is not an instance of the model
      throw new Error("Failed to find a valid cart item");
    }

    // Update the quantity of the cart item
    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
    }
  };

  exports.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const cartItemId = req.params.cartitemid;

    // Implement logic to remove the item from the cart
    await CartItem.destroy({
      where: {
        id: cartItemId,
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

  exports.getProductImage = asyncHandler(async (req, res) => {
    const productId = req.params.productId;

    // Fetch product image data from the database based on the product ID
    const images = await ProductImage.findAll({
      where: { productId },
    });

    if (!images || images.length === 0) {
      // Instead of sending a 404 error, send a response with a specific message
      return res.status(200).json({ message: 'No image available for this product' });
    }

    // Assuming each product has only one image for simplicity
    const image = images[0];

    // Send the image file with an absolute path
    const imagePath = path.join(__dirname, '..', '..', image.imagePath);
    console.log('Image Path:', imagePath); // Log the imagePath
    res.sendFile(imagePath);
  });
  
  exports.getProductImages = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
  
    // Fetch all product images data from the database based on the product ID
    const images = await ProductImage.findAll({
      where: { productId },
    });
  
    if (!images || images.length === 0) {
      // Instead of sending a 404 error, send a response with a specific message
      return res.status(200).json({ message: 'No images available for this product' });
    }
  
    // Send an array of image file paths
    const imagePaths = images.map((image) => path.join(__dirname, '..', '..', image.imagePath));
    console.log('Image Paths:', imagePaths); // Log the imagePaths
    res.status(200).json({ imagePaths });
  });
  exports.getProductSpecifications = asyncHandler(async (req, res) => {
    const productId = req.params.productId;
  
    // Fetch product specifications based on the product ID
    const specifications = await ProductSpecification.findAll({
      raw: true,
      include: {
        model: ProductSpecificationValue,
        where: { productId: productId },
      },
    });
  
    if (!specifications || specifications.length === 0) {
      return res.status(200).json({ message: 'No specifications available for this product' });
    }
  
    res.status(200).json({ data: specifications });
  });
  