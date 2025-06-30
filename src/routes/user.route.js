import Router from "express";
import { registerUser, logoutUser } from "../controllers/register.controller.js";
import upload from './../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)

    // secure routes

    router.route('/logout',verifyJWT, logoutUser)


export default router