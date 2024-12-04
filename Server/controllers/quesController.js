import { Question } from "../models/quesModel.js";
import { User } from "../models/userModel.js";


export const createQuestion = async (req, res) => {
    const { title, description, tag } = req.body;
    const userId = req.user.id; // Assuming `req.user` contains authenticated user details
  
    // Validate inputs
    if (!title || !description || !tag) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    try {
      // Create a new question
      const newQuestion = await Question.create({
        title,
        description,
        tag,
        owner: userId,
      });
  
      return res.status(201).json({
        message: "Question created successfully and is pending approval.",
        question: newQuestion,
      });
    } catch (error) {
      console.error("Error creating question:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };


  export const editQuestion = async (req, res) => {
    try {
      const { id } = req.params; // Question ID from URL params
      const { title, description, tag } = req.body;
      const userId = req.user.id; // User ID from authenticated token
  
      // Find the question by ID
      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      // Check if the current user is the owner of the question
      if (question.owner.toString() !== userId) {
        return res.status(403).json({ message: "You can only edit your own questions" });
      }
  
      // Update the fields
      question.title = title || question.title;
      question.description = description || question.description;
      question.tag = tag || question.tag;
      // redo status to pending if edited
        question.status = "pending";
  
      await question.save();
  
      res.status(200).json({ message: "Question updated successfully", question });
    } catch (error) {
      res.status(500).json({ message: "Error updating question", error });
    }
  };
  
  export const deleteQuestion = async (req, res) => {
    try {
      const { id } = req.params; // Question ID from URL params
      const userId = req.user.id; // User ID from authenticated token
      const isAdmin = req.user.isAdmin; // Admin status from authenticated token
  
      // Find the question by ID
      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
  
      // Allow deletion if the user is the owner or an admin
      if (question.owner.toString() !== userId && !isAdmin) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this question" });
      }
  
      // Delete the question
      await Question.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
      console.error("Error deleting question:", error);
      res.status(500).json({ message: "Error deleting question", error });
    }
  };
  
  

   


  // Admin: View all pending questions
export const viewPendingQuestions = async (req, res) => {
    try {
      const pendingQuestions = await Question.find({ status: "pending" }).populate("owner", "name email");
  
      return res.status(200).json({
        message: "Pending questions retrieved successfully.",
        questions: pendingQuestions,
      });
    } catch (error) {
      console.error("Error fetching pending questions:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };




  // Admin: Approve or reject a question
export const manageQuestionStatus = async (req, res) => {
    const { questionId } = req.params;
    const { status } = req.body; // "approved" or "rejected"
  
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'." });
    }
  
    try {
      const question = await Question.findById(questionId);
  
      if (!question) {
        return res.status(404).json({ message: "Question not found." });
      }
  
      question.status = status;
      await question.save();
  
      return res.status(200).json({
        message: `Question has been ${status}.`,
        question,
      });
    } catch (error) {
      console.error("Error managing question status:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
 

  export const getQuestionById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the question by ID and check if it's approved
      const question = await Question.findOne({ _id: id, status: 'approved' })
        .populate("owner", "name email") // Populate owner details
        .populate("comments.user", "name email"); // Populate comment authors
  
      // If the question is not found or not approved, return an error
      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found or not approved",
        });
      }
  
      // Return the approved question details
      res.status(200).json({
        success: true,
        message: "Approved question fetched successfully",
        question,
      });
    } catch (error) {
      console.error("Error fetching question by ID:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  export const getQuestionByIdALL = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the question by ID and check if it's approved
      const question = await Question.findOne({ _id: id })
        .populate("owner", "name email") // Populate owner details
        .populate("comments.user", "name email"); // Populate comment authors
  
      // If the question is not found or not approved, return an error
      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found ",
        });
      }
  
      // Return the approved question details
      res.status(200).json({
        success: true,
        message: "Approved question fetched successfully",
        question,
      });
    } catch (error) {
      console.error("Error fetching question by ID:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  
  



  export const getApprovedQuestions = async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 questions per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
  
    try {
      // Fetch approved questions with pagination and populate details
      const questions = await Question.find({ status: "approved" })
        .populate("owner", "name email") // Populate owner details (optional)
        .populate("comments.user", "name email") // Populate comment authors (optional)
        .sort({ createdAt: -1 }) // Sort by most recent
        .skip(skip) // Skip questions based on the current page
        .limit(limit); // Limit the number of questions fetched
  
      // Get the total count of approved questions for pagination metadata
      const totalQuestions = await Question.countDocuments({ status: "approved" });
  
      res.status(200).json({
        message: "Approved questions fetched successfully",
        questions,
        currentPage: page,
        totalPages: Math.ceil(totalQuestions / limit),
        totalQuestions,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching approved questions", error });
    }
  };
  

  export const getUserPendingQuestions = async (req, res) => {
    try {
      const pendingQuestions = await Question.find({ 
        owner: req.user._id, 
        status: "pending" 
      }).sort({ createdAt: -1 });
  
      res.status(200).json({ 
        message: "Pending questions fetched successfully", 
        questions: pendingQuestions 
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching pending questions", error });
    }
  };
  
  export const getAllUserQuestions = async (req, res) => {
    try {
      const userQuestions = await Question.find({
        owner: req.user._id,
      }).sort({ createdAt: -1 });
  
      res.status(200).json({
        message: "All questions fetched successfully",

        questions: userQuestions,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error fetching all user questions",
        error,
      });
    }
  };
  
 

  export const addComment = async (req, res) => {
    try {
      const question = await Question.findById(req.params.id);
  
      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }
  
      const { comment } = req.body;
  
      // Check if the user is authorized to comment
      if (
        question.status !== "approved" &&
        question.owner.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
      ) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to comment on this question",
        });
      }
  
      // Add the comment
      question.comments.push({
        user: req.user._id,
        content: comment,
      });
  
      await question.save();
  
      res.status(200).json({
        success: true,
        message: "Comment added successfully",
        question,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  export const getCommentsByQuestionId = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the question by ID and populate only the 'name' field of the user
      const question = await Question.findById(id)
        .populate("comments.user", "name") // Only populate the user's name
        .select("comments"); // Select only the comments field
  
      if (!question) {
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }
  
      // Return the comments from the question
      res.status(200).json({
        success: true,
        message: "Comments fetched successfully",
        comments: question.comments,
      });
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
  




export const getAllQuestionsForAdmin = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query; // Pagination parameters

    const questions = await Question.find()
      .populate("owner", "name email") // Populate owner details
      .sort({ createdAt: -1 }) // Sort by latest first
      .skip((page - 1) * limit) // Apply pagination
      .limit(parseInt(limit)); // Limit the number of questions per page

    const totalQuestions = await Question.countDocuments();

    res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      questions,
      pagination: {
        totalQuestions,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalQuestions / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
      error,
    });
  }
};

  

  



 