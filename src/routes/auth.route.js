const Router = require('express')
const router = Router();


const {
    loginUser,
    verifyOtp,
    logoutUser,
    registerUser,
    refreshAccessToken,
} = require("../controllers/auth.controller.js");
const verifyJWT = require("../middlewares/auth.middleware.js");
const { upload } = require("../middlewares/multer.middleware.js")
const { userValidation } = require('../validations/userValidation.js');



router.route("/signup").post(
    upload.single("profileImage"), userValidation, registerUser)

router.route("/login").post(loginUser)

router.route("/verfiyOtp").post(verifyOtp)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.get('/testing', verifyJWT, (req, res) => {
    console.log("req.user", req.user);

    console.log("Testing");
    res.end("Testing")

})
router.route("/refresh-token").post(refreshAccessToken)

module.exports = router;