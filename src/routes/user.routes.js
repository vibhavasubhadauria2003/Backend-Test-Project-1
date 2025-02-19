import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/authentication.middleware.js";
const router=Router();
router.route();

router.route("/register").post(
    upload.fields([
        {
            name:"avtar",
            maxCount: 1
        },
        {
            name:"coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default userRouter; 