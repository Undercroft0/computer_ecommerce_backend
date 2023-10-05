const router = require("express").Router();
const { createCategory } = require("../controllers/product_categories.Controller");

router.route("/createCategory").post(createCategory);


module.exports = router;