const router = require("express").Router();
const { createProduct, editProduct, viewProduct, rateProduct, getAllProducts, addToCart } = require("../controllers/product.Controller");

router.route("/createProduct").post(createProduct);
router.route("/editProduct").post(editProduct);
router.route("/viewProduct/:id").get(viewProduct);

router.route("/rateProduct/:id/:userid").post(rateProduct);
router.route("/addToCart/:userid").post(addToCart);

router.route("/getAllProducts").get(getAllProducts);

module.exports = router;
