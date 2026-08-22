import express from 'express';
import { generateOtp, loginUser, registerUser, verifyOtp } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.post('/register-user',registerUser)
userRouter.post('/login-user',loginUser)
userRouter.post('/generate-otp',generateOtp)
userRouter.post('/verify-otp',verifyOtp)

export default userRouter;