import express from "express";
import { FetchUsers } from "../../controllers/user/read";
import { CreateUser } from "../../controllers/user/add";
import { UpdateUser } from "../../controllers/user/update";
import { DeleteUser } from "../../controllers/user/delete";
import { RoleGuard } from "../../middlewares/role-guard";

const router = express.Router();

router.get("/fetch-users", FetchUsers);
router.post("/create-user", RoleGuard, CreateUser);
router.put("/update-user/:id", RoleGuard, UpdateUser);
router.delete("/delete-user/:id", RoleGuard, DeleteUser);

export default router;
