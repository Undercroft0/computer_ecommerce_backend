const router = require("express").Router();
const { createCategory , viewAllCategories, viewCategory} = require("../controllers/product_categories.Controller");

router.route("/createCategory").post(createCategory);
router.route("/viewAllCategories").get(viewAllCategories);

module.exports = router;