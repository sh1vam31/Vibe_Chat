import express from 'express';
import { getMessages,getusersForSidebar,markMessageAsSeen, sendMessage } from '../controllers/messageController';
import { protectRoute } from '../middleware/auth';

const messageRouter = express.Router();

messageRouter.get("/users",protectRoute,getUsersForSidebar);
messageRouter.get("/:id",protectRoute,getMessages);
messageRouter.get("/mark/:id",protectRoute,getMessagesAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);

export default messageRouter;