import express from 'express'
import { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile, changeUserPassword, forgotPassword, resetPassword } from '../controllers/userController.js'
import authUser from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.post('/profile', authUser, getUserProfile)
userRouter.post('/update-profile', authUser, updateUserProfile)
userRouter.post('/change-password', authUser, changeUserPassword)
userRouter.post('/forgot-password', forgotPassword);
userRouter.put('/reset-password/:token', resetPassword);

export default userRouter;