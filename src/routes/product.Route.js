const router = require("express").Router();
const { createProduct } = require ("../controllers/product.Controller");


router.route("/createProduct").post(createProduct);


module.exports = router;