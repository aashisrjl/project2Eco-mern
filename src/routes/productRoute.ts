import express,{Router}  from "express";
import productController from "../controllers/productController";
import catchAsyncError from '../services/catchAsyncError';
import AuthMiddleware, { Role } from "../middleware/AuthMiddleware";
const router:Router = express.Router()
// import upload
import { upload } from "../middleware/multerMiddleware";

router.route("/").post(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    upload.single('productImageUrl'),
    catchAsyncError(productController.addProduct)
)
.get(productController.getAllProducts)

router.route("/:id").get(catchAsyncError(productController.getSingleProduct))
    .delete(
        AuthMiddleware.isAuthenticated,
        AuthMiddleware.restrictTo(Role.Admin),
        catchAsyncError(productController.deleteProduct))


export default router;