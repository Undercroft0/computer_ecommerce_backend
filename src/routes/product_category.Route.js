const router = require("express").Router();
const { createCategory , viewAllCategories, viewCategory, addSpecification, getSpecificationsByCategory, addValue }= require("../controllers/product_categories.Controller");

router.route("/createCategory").post(createCategory);
router.route("/viewAllCategories").get(viewAllCategories);



router.route("/addSpecification").post(addSpecification);
router.route("/getSpecificationsByCategory/:category_id").get(getSpecificationsByCategory);
router.route("/addSpecValue").post(addValue);

module.exports = router;