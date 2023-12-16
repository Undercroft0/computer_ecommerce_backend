// product.Route.js

const router = require("express").Router();
const { createProduct, editProduct, viewProduct, rateProduct, getAllProducts, 
    addToCart, getProductImage, getProductImages, getProductSpecifications, getCart 
    , updateCartItem, removeFromCart} = require("../controllers/product.Controller");
const { protect } = require("../middleware/protect");
const imageUpload = require('../middleware/product_image');

router.route("/createProduct").post(imageUpload, createProduct);
router.route("/editProduct").post(editProduct);
router.route("/viewProduct/:id").get(viewProduct);

router.route("/rateProduct").post(protect,rateProduct);
router.route("/addToCart/:userid").post(addToCart);
router.route("/getCart/:userid").get(getCart);
router.route("/updateCartItem").put(updateCartItem);
router.route("/removeFromCart/:userid/:cartitemid").delete(removeFromCart); 

router.route("/getAllProducts").get(getAllProducts);
router.route("/productImage/:productId").get(getProductImage);
router.route("/productImage/:productId").get(getProductImages);

router.route("/getSpecifications/:productId").get(getProductSpecifications);

module.exports = router;
