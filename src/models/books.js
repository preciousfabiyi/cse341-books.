import { connectToDatabase } from "../../database/connection.js";

// Get all books
export async function getAllBooks() {
  const db = await connectToDatabase();

  return await db.collection("books").find({}).toArray();
}

// Get one book by ID
export async function getBookById(id) {
  const db = await connectToDatabase();

  return await db.collection("books").findOne({ id });
}

// Create a new book
export async function createBook(book) {
  const db = await connectToDatabase();

  return await db.collection("books").insertOne(book);
}

// Update a book
export async function updateBook(id, book) {
  const db = await connectToDatabase();

  return await db.collection("books").updateOne(
    { id },
    { $set: book }
  );
}

// Delete a book
export async function deleteBook(id) {
  const db = await connectToDatabase();

  return await db.collection("books").deleteOne({ id });
}