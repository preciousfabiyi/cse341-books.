import express from "express";
import { connectToDatabase } from "../database/connection.js";

const router = express.Router();

// GET /books - Retrieve all books

   // GET /books/:id - Retrieve one book by id
router.get("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const bookId = Number(req.params.id);

    if (!Number.isInteger(bookId)) {
      return res.status(400).json({
        error: "Book ID must be a valid integer.",
      });
    }

    const book = await db.collection("books").findOne({ id: bookId });

    if (!book) {
      return res.status(404).json({
        error: "Book not found.",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error retrieving book:", error.message);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
});
export default router;