import { Router } from "express";
import {
  getRoomByTokenHandler,
  joinRoomHandler,
} from "../controllers/roomController.js";
import asyncHandler from "../middleware/asyncHandler.js";


const roomRouter: Router = Router();

roomRouter.get("/:token", asyncHandler(getRoomByTokenHandler));
roomRouter.post("/:token/join", asyncHandler(joinRoomHandler));

export default roomRouter;