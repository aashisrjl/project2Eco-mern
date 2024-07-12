import express,{Router}  from "express";
import productController from "../controllers/productController";
import catchAsyncError from '../services/catchAsyncError';
import AuthMiddleware, { Role } from "../middleware/AuthMiddleware";
const router:Router = express.Router()
// import upload
import { upload } from "../middleware/multerMiddleware";
import errorHandler from "../services/catchAsyncError";

router.route("/").post(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    upload.single('productImageUrl'),
    errorHandler(productController.addProduct)
)
.get(productController.getAllProducts)

router.route("/:id").get(catchAsyncError(productController.getSingleProduct))
    .delete(
        AuthMiddleware.isAuthenticated,
        AuthMiddleware.restrictTo(Role.Admin),
        errorHandler(productController.deleteProduct))
        .patch(
            AuthMiddleware.isAuthenticated,
            AuthMiddleware.restrictTo(Role.Admin),
            upload.single('productImageUrl'),
            errorHandler(productController.productUpdate)
        )


export default router;