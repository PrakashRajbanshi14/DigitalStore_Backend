import express, { Router } from 'express'
import categoryController from '../controllers/categoryController'
import userMiddleware, { Role } from '../middleware/userMiddleware'
const router:Router = express.Router()

router.route("/")
	.get(categoryController.getCategories)
	.post(userMiddleware.isUserLoggedIn as any, userMiddleware.restrictTo(Role.Admin) as any, categoryController.addCategory)
    
router.route("/:id")
    .patch(userMiddleware.isUserLoggedIn,userMiddleware.restrictTo(Role.Admin) as any, categoryController.updateCategory)
    .delete(userMiddleware.isUserLoggedIn,userMiddleware.restrictTo(Role.Admin) as any, categoryController.deleteCategory)

export default router 