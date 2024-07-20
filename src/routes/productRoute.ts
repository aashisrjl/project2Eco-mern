import express,{Router}  from "express";
import productController from "../controllers/productController";
import catchAsyncError from '../services/catchAsyncError';
import AuthMiddleware, { Role } from "../middleware/AuthMiddleware";
const router:Router = express.Router()
// import upload
import { upload } from "../middleware/multerMiddleware";
import errorHandler from "../services/catchAsyncError";

//add product by admin
router.route("/").post(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    upload.single('productImageUrl'),
    errorHandler(productController.addProduct)
)
// fetch all records
.get(productController.getAllProducts)

router.route("/:id").get(catchAsyncError(productController.getSingleProduct))
    .delete(
        AuthMiddleware.isAuthenticated,
        AuthMiddleware.restrictTo(Role.Admin),
        errorHandler(productController.deleteProduct))
        // product update by admin
        .patch(
            AuthMiddleware.isAuthenticated,
            AuthMiddleware.restrictTo(Role.Admin),
            upload.single('productImageUrl'),
            errorHandler(productController.productUpdate)
        )


export default router;