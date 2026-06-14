import express, { Router } from 'express'
import productController from '../controllers/productController'
import userMiddleware, { Role } from '../middleware/userMiddleware'
const router:Router = express.Router()

router.route("/")
    .get( productController.getAllProducts)
    .post(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin), productController.createProduct)

router.route("/:id")
    .get(productController.getSingleProduct)
    .delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin), productController.deleteProduct)

export default router