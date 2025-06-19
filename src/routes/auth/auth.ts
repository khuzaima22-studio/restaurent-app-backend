import express from "express";
import { Auth } from "../../controllers/auth/authUser";
import { SeedUsers } from "../../controllers/users/seedUser";

const router = express.Router();

router.post("/auth", Auth);
router.get("/seed-user", SeedUsers);
export default router;
