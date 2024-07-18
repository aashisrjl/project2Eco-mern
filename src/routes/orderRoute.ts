import express,{Router} from 'express';
import AuthMiddleware, { Role } from '../middleware/AuthMiddleware';
import errorHandler from '../services/catchAsyncError';
import orderController from '../controllers/orderController';
const router:Router = express.Router();

router.route("/").post(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.createOrder
    ))

router.route("/verify").post(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.verifyTransaction)
)

router.route("/customer/").get(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.fetchMyOrders))

//fetch detail of order and cancel order
router.route("/customer/:id").get(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.fetchOrderDetails))
.patch(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Customer),
    errorHandler(orderController.cancelMyOrder)
)


export default  router;