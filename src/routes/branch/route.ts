import express from "express";
import { FetchBranch } from "../../controllers/branch/read";

const router = express.Router();

router.get(`/fetch-branches/:id`, FetchBranch);
router.get(`/fetch-branches`, FetchBranch);

export default router;
