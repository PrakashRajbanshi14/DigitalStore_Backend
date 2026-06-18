import express, { Router } from 'express'
import userMiddleware from '../middleware/userMiddleware'
import errorHandler from '../services/errorHandler'
import orderController from '../controllers/orderController'
const router:Router = express.Router()

router.route("/")
    .post(userMiddleware.isUserLoggedIn, errorHandler(orderController.createOrder))


export default router