import express from "express";
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  toggleWatchlist,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/watchlist", getWatchlist);
router.post("/watchlist/toggle/:movieId", toggleWatchlist);
router.post("/watchlist/:movieId", addToWatchlist);
router.delete("/watchlist/:movieId", removeFromWatchlist);

export default router;
