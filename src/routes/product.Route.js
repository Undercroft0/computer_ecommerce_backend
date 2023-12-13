// product.Route.js

const router = require("express").Router();
const { createProduct, editProduct, viewProduct, rateProduct, getAllProducts, 
    addToCart, getProductImage, getProductSpecifications, getCart 
    , updateCartItem, removeFromCart} = require("../controllers/product.Controller");
const imageUpload = require('../middleware/product_image');

router.route("/createProduct").post(imageUpload, createProduct);
router.route("/editProduct").post(editProduct);
router.route("/viewProduct/:id").get(viewProduct);

router.route("/rateProduct/:id/:userid").post(rateProduct);
router.route("/addToCart/:userid").post(addToCart);
router.route("/getCart/:userid").get(getCart);
router.route("/updateCartItem").put(updateCartItem);
router.route("/removeFromCart/:userid/:cartitemid").delete(removeFromCart); 

router.route("/getAllProducts").get(getAllProducts);
router.route("/productImage/:productId").get(getProductImage);

router.route("/getSpecifications/:productId").get(getProductSpecifications);

module.exports = router;
