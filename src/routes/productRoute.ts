import express,{Router}  from "express";
import productController from "../controllers/productController";
import catchAsyncError from '../services/catchAsyncError';
import AuthMiddleware, { Role } from "../middleware/AuthMiddleware";
const router:Router = express.Router()
import {multer,storage} from '../middleware/multerMiddleware';

const upload = multer({storage:storage});

router.route("/").post(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    upload.single('image'),
    catchAsyncError(productController.addProduct)
)


export default router;