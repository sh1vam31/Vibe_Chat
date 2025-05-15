import express from 'express';
import { protectRoute } from '../middleware/auth';
import { checkAuth, updateprofile } from '../controllers/userController';

const userRouter = express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",login)
userRouter.put("/update-profile",protectRoute,updateprofile)
userRouter.get("/check",protectRoute,checkAuth);

export default userRouter