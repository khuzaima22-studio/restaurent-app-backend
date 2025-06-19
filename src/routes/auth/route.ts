import express from "express";
import { Login } from "../../controllers/auth/login";
import { InitialData } from "../../controllers/user/initial-data";

const router = express.Router();

router.post("/login", Login);
router.get("/feed", InitialData);
export default router;
