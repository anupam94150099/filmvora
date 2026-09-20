import express from "express";
import {
  getMovies,
  getMovie,
  getCategoryMovies,
  instantSearch,
  createMovie,
  updateMovie,
  deleteMovie,
  addMovieReview,
  getMovieReviews,
  requestDownload,
} from "../controllers/movieController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getMovies)
  .post(protect, adminOnly, createMovie);

router.route("/instant-search")
  .get(instantSearch);

router.route("/categories/:category")
  .get(getCategoryMovies);

router.route("/:id/download")
  .post(requestDownload);

router.route("/:id")
  .get(getMovie)
  .put(protect, adminOnly, updateMovie)
  .delete(protect, adminOnly, deleteMovie);

router.route("/:id/reviews")
  .get(getMovieReviews)
  .post(protect, addMovieReview);

export default router;
