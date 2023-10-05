const router = require("express").Router();
const { uploadProfile, displayImage, registerUploadProfile, getOwnProfile} = require("../controllers/upload.Controller");
const { protect } = require("../middleware/protect");
const { route } = require("./users.Route");

const { deleteProfile, updateProfile,displayWithUsername, setDefaultProfilePicture } = require("../controllers/upload.Controller");

router.route("/uploadImage").post(uploadProfile);
router.route("/registerUploadImage/:userid").post(registerUploadProfile);
router.route("/displayImage/:userId").get(displayImage);
router.route("/deleteImage").delete(protect,deleteProfile);
router.route("/updateImage").put(protect,updateProfile);  //should be in protect
router.route("/displayWithUsername/:username").get(displayWithUsername);
router.route("/:username/getOwnPro").get(getOwnProfile);
router.route("/setDefaultProfilePicture/:userid").post(setDefaultProfilePicture);
module.exports = router;