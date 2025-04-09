import express from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import authController from '../controllers/auth.controller'

const router = express.Router()

router.post('/auth/register', authController.register)
router.post('/auth/login', authController.login)
router.get('/auth/me', authMiddleware, authController.me)

export default router
