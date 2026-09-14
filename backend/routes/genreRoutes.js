import express from "express";
import {
  getGenres,
  getGenreBySlug,
  createGenre,
  updateGenre,
  deleteGenre,
} from "../controllers/genreController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getGenres)
  .post(protect, adminOnly, createGenre);

router.route("/:slug")
  .get(getGenreBySlug);

router.route("/id/:id")
  .put(protect, adminOnly, updateGenre)
  .delete(protect, adminOnly, deleteGenre);

export default router;
