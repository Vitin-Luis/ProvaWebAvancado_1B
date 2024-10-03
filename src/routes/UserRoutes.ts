import { Router } from "express";

import UserController from "../controllers/UserController";

const UserRouter = Router();



UserRouter.get("/users", UserController.listUser);


UserRouter.post("/user", UserController.createUser);


UserRouter.put("/user/:id", UserController.updateUser);


UserRouter.delete("/user/:id", UserController.deleteUser);

export default UserRouter;