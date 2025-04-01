import { Router } from "express";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";
import { createChannelController, getMessagesListFromChannelController, sendMessageToChannelController } from "../controllers/channel.controller.js";

const channelRouter = Router()

channelRouter.post('/:workspace_id', AuthMiddleware, createChannelController)

channelRouter.post("/:channel_id/messages", AuthMiddleware, sendMessageToChannelController);

channelRouter.get("/:channel_id/messages", AuthMiddleware , getMessagesListFromChannelController);

export default channelRouter