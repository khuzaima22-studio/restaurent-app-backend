import express from "express";
import { FetchOrders } from "../../controllers/order/read";
import { CreateOrder } from "../../controllers/order/add";
import { ChangeOrderStatus } from "../../controllers/order/change-status";

const router = express.Router();

router.get(`/fetch-orders/:id`, FetchOrders);
router.post(`/create-order`, CreateOrder);
router.patch(`/change-order-status`, ChangeOrderStatus);

export default router;
