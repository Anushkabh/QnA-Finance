
import express from "express";
import {
  createQuestion,
  editQuestion,
  deleteQuestion,
  viewPendingQuestions,
  manageQuestionStatus,
  getApprovedQuestions,
  getUserPendingQuestions,
  addComment,
  getQuestionById,
  getCommentsByQuestionId,

  getAllUserQuestions,
  getQuestionByIdALL,
  getAllQuestionsForAdmin
} from "../controllers/quesController.js"; // Adjust the path to your controller file
import { isAuthenticated, isAdmin } from "../middlewares/auth.js"; // Add authentication and role-based middlewares if needed

const router = express.Router();

// User routes
router.post("/create", isAuthenticated, createQuestion); // Create a new question d

router.get("/approved",  getApprovedQuestions); // Get all approved questions
router.get("/pending", isAuthenticated, getUserPendingQuestions); // Get user's pending questions d
router.get("/every",isAuthenticated, getAllUserQuestions); // Get all questions
router.put("/:id", isAuthenticated, editQuestion); // Edit a question d
router.delete("/:id", isAuthenticated, deleteQuestion) //d
router.post("/:id/comment", isAuthenticated, addComment); // Add a comment to a question  d
router.get("/:id",isAuthenticated, getQuestionById); // Get a question by ID but onlypproved
router.get("/:id/all", getQuestionByIdALL); // Get a question by ID but onlypproved
router.get("/:id/comments", getCommentsByQuestionId); // Get comments by question ID



// Admin routes
router.get("/admin/pending", isAuthenticated, isAdmin, viewPendingQuestions); // View all pending questions
router.get("/admin/questions", isAuthenticated, isAdmin, getAllQuestionsForAdmin);

router.patch("/admin/:questionId/status", isAuthenticated, isAdmin, manageQuestionStatus); // Approve or reject a question

export default router;
