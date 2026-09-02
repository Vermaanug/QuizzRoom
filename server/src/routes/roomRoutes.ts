import { Router } from "express";
import {
  endRoomHandler,
  getAllPastRoomHandler,
  getRoomByTokenHandler,
  joinRoomHandler,
} from "../controllers/roomController.js";
import asyncHandler from "../middleware/asyncHandler.js";
import authMiddleware from "../middleware/authMiddleware.js";


const roomRouter: Router = Router();

roomRouter.get(
  "/past-rooms",
  authMiddleware,
  asyncHandler(getAllPastRoomHandler)
);

roomRouter.post(
  "/:id/end",
  authMiddleware,
  asyncHandler(endRoomHandler)
);

roomRouter.get("/:token", asyncHandler(getRoomByTokenHandler));
roomRouter.post("/:token/join", asyncHandler(joinRoomHandler));


export default roomRouter;