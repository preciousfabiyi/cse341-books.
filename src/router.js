import express from "express";

import {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler,
} from "./controllers/authors.js";

import {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler,
} from "./controllers/books.js";

const router = express.Router();

// GET /authors - Retrieve all authors
router.get("/authors", getAuthorsHandler);

// GET /authors/:id - Retrieve one author by ID
router.get("/authors/:id", getAuthorByIdHandler);

// POST /authors - Create a new author
router.post("/authors", createAuthorHandler);

// GET /books - Retrieve all books
router.get("/books", getBooksHandler);

// GET /books/:id - Retrieve one book by ID
router.get("/books/:id", getBookByIdHandler);

// PUT /authors/:id - Update an author
router.put("/authors/:id", updateAuthorHandler);

// DELETE /authors/:id - Delete an author
router.delete("/authors/:id", deleteAuthorHandler);

// POST /books - Create a book
router.post("/books", createBookHandler);

// PUT /books/:id - Update a book
router.put("/books/:id", updateBookHandler);

// DELETE /books/:id - Delete a book
router.delete("/books/:id", deleteBookHandler);

export default router;