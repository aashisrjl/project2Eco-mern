import express,{Router} from 'express';
import AuthMiddleware from '../middleware/AuthMiddleware';
import errorHandler from '../services/catchAsyncError';
import cartController from '../controllers/cartController';

const router:Router = express.Router();

router.route("/").post(AuthMiddleware.isAuthenticated,errorHandler(cartController.addToCart))
.get(AuthMiddleware.isAuthenticated,errorHandler(cartController.getCartItem));


export default router;