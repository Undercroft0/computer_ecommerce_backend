let express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require('path');
const app = express();
const port = process.env.PORT;

const loginRoute = require('../routes/login.Route');
const usersRoute = require('../routes/users.Route');
const commentsRoute = require('../routes/comments.Route');
const productRoute = require('../routes/product.Route');
//db table add 
const Users = require('../models/users')
const Comments = require('../models/comments')
const Upload = require('../models/upload');
const Product = require('../models/product');
const ProductCategory = require('../models/product_category');
const ProductInventory = require('../models/product_inventory');
const ProductRating = require('../models/product_rating');

const CartItem = require('../models/cart_items');
const UserAddress = require('../models/user_address');
const OrderDetails = require('../models/order');
const ProductImage = require("../models/product_image");
const ProductSpecification = require("../models/product_specification");
const ProductSpecificationValue = require("../models/product_spec_values");


// const scheduler = require("./scheduler"); // устгаж болохгүй!!!
//uuganaaa
function initialize() {
  const app = express();
  app.use(morgan("dev"));
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: false }));
  
  app.use(
    express.json({
      limit: "50mb",
    })
  );
  app.use(
    express.urlencoded({
      limit: "50mb",
    })
  );
  app.use(
    helmet.hidePoweredBy(),
    helmet.noSniff(),
    helmet.xssFilter(),
    helmet.contentSecurityPolicy(),
    helmet.crossOriginEmbedderPolicy(),
    helmet.frameguard()
  );
  app.use(cors());
  app.use(express.json());
  
  const loginRoute = require('../routes/login.Route');
  const usersRoute = require('../routes/users.Route');
  const commentsRoute = require('../routes/comments.Route');
  const uploadRoute = require('../routes/upload.Route');
  const productRoute = require('../routes/product.Route');
  const categoryRoute = require('../routes/product_category.Route');

  app.use('/auth', loginRoute);
  app.use('/user', usersRoute);
  app.use('/comment', commentsRoute);
  app.use('/image',uploadRoute);
  app.use('/product', productRoute);
  app.use('/category', categoryRoute);
  app.use('/uploads', express.static(path.join(__dirname, '../src/upload'))); // Serve static files from the 'src/upload' folder
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/upload/index.html'));
  });
  

  app.use("/public", express.static("public"));
  

  ProductCategory.sync()
  .then(() => Product.sync())
  .then(() => Users.sync())
  .then(() => Upload.sync())
  .then(() => Comments.sync())
  .then(() => ProductInventory.sync())
  .then(() => ProductRating.sync())
  .then(() => CartItem.sync())
  .then(() => UserAddress.sync())
  .then(() => OrderDetails.sync())
  .then(() => ProductImage.sync())
  .then(() => ProductSpecification.sync())
  .then(() => ProductSpecificationValue.sync())
  
  app.listen(process.env.PORT, function () {
    console.log("Server is ready at : " + process.env.PORT + " port");
  });
}

function close() {}

module.exports.initialize = initialize;
module.exports.close = close;