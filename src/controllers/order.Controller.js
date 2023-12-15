const asyncHandler = require("../middleware/asyncHandler");

const Order  = require('../models/order');
const CartItem = require("../models/cart_items");
const OrderItem = require('../models/order_items');
const Product = require('../models/product'); 
// Controller to create an order and associated order items
exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Retrieve cart items for the user
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price'],
        },
      ],
      raw: false, // Add this line
    });

    console.log('Cart Items:', cartItems); // Log cartItems for debugging

    // Create a new order for the user
    const order = await Order.create({
      userId,
      state: 'pending',
    });

    const orderItemsPromises = cartItems.map(async (cartItem) => {
      // Retrieve the product properly
      const product = cartItem.product instanceof Product ? cartItem.product : await cartItem.getProduct();
      console.log('Retrieved Product:', product); // Log the retrieved product for debugging
      await OrderItem.create({
        orderId: order.id,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        price: product.price,
      });
    });

    await Promise.all(orderItemsPromises);

    // Optional: You can clear the user's cart after creating the order
    await CartItem.destroy({
      where: { userId },
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Controller to get an order
exports.getOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // Retrieve the order
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


// Controller to get all orders
exports.getOrders = async (req, res, next) => {
  try {
    // Retrieve all orders
    const orders = await Order.findAll();

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

