import express from "express";
import {addToCart, getCart, removeFromCart, updateCart} from "../controllers/cartController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addToCart).get(protect, getCart);
router.route("/").delete(protect, removeFromCart).put(protect, updateCart);

export default router;