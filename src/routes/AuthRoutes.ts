import { Router } from "express";
import AuthController from "../controllers/AuthController";

const AuthRouter = Router();

AuthRouter.post("/auth/signin", AuthController.signin);

AuthRouter.post("/auth/signup", function () {});

AuthRouter.post("/auth/signout", function () {});

export default AuthRouter;