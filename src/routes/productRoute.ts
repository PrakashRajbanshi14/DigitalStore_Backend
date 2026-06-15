import express, { Router } from 'express'
import productController from '../controllers/productController'
import userMiddleware, { Role } from '../middleware/userMiddleware'
import {multer, storage} from "../middleware/multerMiddleware"
const upload = multer({storage: storage})
const router:Router = express.Router()

router.route("/")
    .get( productController.getAllProducts)
    .post(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin),upload.single('productImage'), productController.createProduct)

router.route("/:id")
    .get(productController.getSingleProduct)
    .put(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin), upload.single('productImage'), productController.updateProduct)
    .delete(userMiddleware.isUserLoggedIn, userMiddleware.accessTo(Role.Admin), productController.deleteProduct)

export default router 