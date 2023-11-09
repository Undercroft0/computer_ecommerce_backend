const router = require("express").Router();
const { createProduct, editProduct, viewProduct, rateProduct , getAllProducts} = require ("../controllers/product.Controller");


router.route("/createProduct").post(createProduct);
router.route("/editProduct").post(editProduct);
router.route("/viewProduct").post(viewProduct);
router.route("/rateProduct").post(rateProduct);
router.route("/getAllProducts").get(getAllProducts);


module.exports = router;