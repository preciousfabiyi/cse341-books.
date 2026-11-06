import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../models/books.js";

import { connectToDatabase } from "../../database/connection.js";

// GET all books
export async function getBooksHandler(req, res) {
  try {
    const books = await getAllBooks();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error retrieving books:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET one book by ID
export async function getBookByIdHandler(req, res) {
  try {
    const { id } = req.params;
    const book = await getBookById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error retrieving book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST a new book
export async function createBookHandler(req, res) {
  try {
    const { id, authorId, title, publicationDate } = req.body;

    if (
      !id ||
      typeof id !== "string" ||
      !authorId ||
      typeof authorId !== "string" ||
      !title ||
      typeof title !== "string" ||
      !publicationDate ||
      typeof publicationDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate) ||
      Number.isNaN(Date.parse(publicationDate)) ||
      new Date(`${publicationDate}T00:00:00.000Z`).toISOString().slice(0, 10) !== publicationDate
    ) {
      return res.status(400).json({
        message: "Please provide a valid id, authorId, title, and publicationDate (YYYY-MM-DD).",
      });
    }

    const db = await connectToDatabase();
    const author = await db.collection("authors").findOne({ id: authorId });

    if (!author) {
      return res.status(400).json({
        message: "The specified author does not exist.",
      });
    }

    const existingBook = await getBookById(id);

    if (existingBook) {
      return res.status(409).json({
        message: "A book with this ID already exists.",
      });
    }

    const book = { id, authorId, title, publicationDate };
    await createBook(book);

    res.status(201).json({
      message: "Book created successfully.",
      book,
    });
  } catch (error) {
    console.error("Error creating book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// PUT - Update a book
export async function updateBookHandler(req, res) {
  try {
    const { id } = req.params;
    const { authorId, title, publicationDate } = req.body;

    if (
      !authorId ||
      typeof authorId !== "string" ||
      !title ||
      typeof title !== "string" ||
      !publicationDate ||
      typeof publicationDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate) ||
      Number.isNaN(Date.parse(publicationDate)) ||
      new Date(`${publicationDate}T00:00:00.000Z`).toISOString().slice(0, 10) !== publicationDate
    ) {
      return res.status(400).json({
        message: "Please provide a valid authorId, title, and publicationDate (YYYY-MM-DD).",
      });
    }

    const existingBook = await getBookById(id);

    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    const db = await connectToDatabase();
    const author = await db.collection("authors").findOne({ id: authorId });

    if (!author) {
      return res.status(400).json({
        message: "The specified author does not exist.",
      });
    }

    const updatedBook = { authorId, title, publicationDate };
    await updateBook(id, updatedBook);

    res.status(200).json({
      message: "Book updated successfully.",
      book: { id, ...updatedBook },
    });
  } catch (error) {
    console.error("Error updating book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE a book
export async function deleteBookHandler(req, res) {
  try {
    const { id } = req.params;
    const existingBook = await getBookById(id);

    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    await deleteBook(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}