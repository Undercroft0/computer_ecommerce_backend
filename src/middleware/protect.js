const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const morgan = require("morgan");
const logger = morgan("combined");

exports.protect = asyncHandler(async (req, res, next) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization) {
    res.status(401).json({
      success: false,
      message: "Нэвтэрсний дараа энэ үйлдлийг хийх боломжтой",
    });
    return;
  }
  // Request header from which to extract the bearer token
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Нэвтэрсний дараа энэ үйлдлийг хийх боломжтой",
    });
    return;
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.decode(token, { complete: true });

    req.userid = decoded.payload.userid;
    req.email = decoded.payload.email;

    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Токен хүчингүй байна.",
      err,
    });
    return;
  }
});
