import { Router } from "express";
import {
  getRoomByTokenHandler,
  joinRoomHandler,
} from "../controllers/roomController.js";


const roomRouter: Router = Router();

roomRouter.get("/:token", getRoomByTokenHandler);
roomRouter.post("/:token/join", joinRoomHandler);

export default roomRouter;