import express,{Router} from 'express';
import AuthMiddleware, { Role } from '../middleware/AuthMiddleware';
import errorHandler from '../services/catchAsyncError';
import orderController from '../controllers/orderController';
const router:Router = express.Router();

// user side 
// create order
router.route("/").post(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.createOrder
    ))

//verify transaction with pidx if the user pay all the payment
router.route("/verify").post(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.verifyTransaction)
)
//get all the order made by customer for both user and admin
router.route("/customer/").get(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.fetchMyOrders))

//fetch detail of order and cancel order
router.route("/customer/:id").get(
    AuthMiddleware.isAuthenticated,
    errorHandler(orderController.fetchOrderDetails))
    //updating orderStatus to cancelled
.patch(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Customer),
    errorHandler(orderController.cancelMyOrder)
)
//admin 
// to update payment status

router.route("/admin/payment/:id")
.patch(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    errorHandler(orderController.changePaymentStatus))

//to change order status
// to delete Order which is cancelled by customer
router.route("/admin/:id")
.patch(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    errorHandler(orderController.changeOrderStatus))
    // delete the order cancel by user 
    .delete(
        AuthMiddleware.isAuthenticated,
    AuthMiddleware.restrictTo(Role.Admin),
    errorHandler(orderController.deleteOrder)
    )




export default  router;