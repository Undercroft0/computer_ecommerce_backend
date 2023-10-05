const asyncHandler = require("../middleware/asyncHandler");
const { Op, QueryTypes, Sequelize } = require("sequelize");
const e = require("express");
const users = require("../models/users");
const product = require("../models/product"); 
const comments = require("../models/comments");

exports.createComment = asyncHandler(async (req, res, netx) => {
  // try{
  const userid = req.userid;
  const productid  = req.params.id;
  const {comment} = req.body;
 // console.log(Date.now());
 if(comment){
  const newComment = await comments.create({
  userid:userid,
  productid:productid,
  comment : comment,
});

// console.log("88888888888888888888888888")
if(newComment){
  // console.log("added")
  //console.log(commento);
  return res.status(200).json({
    success: true,
    data: newComment
  });

}else{
  // console.log("-----------------------------------------")
  return res.status(500).json({
    success: false,
    message: "failed"
  })
}
}
else{ res.status(400).json({success: false,message: "table is empty"});}
  

});

exports.getComments = asyncHandler(async (req, res, next) => {
  const id = req.params.id; 
  const productComments = await comments.findAll({
    where: {
      productid: id,
    },
    order:[["createdAt","DESC"]]
  });
  for(let i in productComments){
    const user = await users.findOne({
      where:{
        id:productComments[i].userid
      }
    });
    productComments[i].username = user.username;
  }
  if (productComments) {
    res.status(200).json(productComments);
  } else {
    res.status(400).json("Comments doesn't exist!");
  }
});

exports.editComment = asyncHandler(async (req, res, next) => {
  try {
    const { commentsid } = req.params;
    const user = req.user;
    const comment = await comments.findById();
    if (commentsid + "" !== usersid + "") {
      throw new Error("You cannot edit that comment, because you not owner");
    }
    comment.posteddate = posteddate();
    comment.save();
    res.status(200).json("Comment edited");
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const { id, userid } = req.params;
  const comment = await comments.findById(id);
  if (comment) {
    if (comment.userid + "" !== "" + userid + "") {
      res
        .status(200)
        .json("can't delete comment because you're not the owner!");
    } else {
      comments.splice(index, 1);
      comment.remove();
      res.status(200).json("Comment deleted successfully");
    }
  } else res.status(200).json("Comment doesn't exist");
});
