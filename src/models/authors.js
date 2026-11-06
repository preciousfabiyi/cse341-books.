import { connectToDatabase } from "../../database/connection.js";

// Get all authors
export async function getAllAuthors() {
  const db = await connectToDatabase();

  return await db.collection("authors").find({}).toArray();
}

// Get one author by ID
export async function getAuthorById(id) {
  const db = await connectToDatabase();

  return await db.collection("authors").findOne({ id });
}

// Create a new author
export async function createAuthor(author) {
  const db = await connectToDatabase();

  const result = await db.collection("authors").insertOne(author);

  return result;
}
// Update an author
export async function updateAuthor(id, author) {
  const db = await connectToDatabase();

  const result = await db.collection("authors").updateOne(
    { id },
    { $set: author }
  );

  return result;
}

// Check whether an author has associated books
export async function authorHasBooks(id) {
  const db = await connectToDatabase();

  const book = await db.collection("books").findOne({
    authorId: id,
  });

  return Boolean(book);
}

// Delete an author
export async function deleteAuthor(id) {
  const db = await connectToDatabase();

  return await db.collection("authors").deleteOne({ id });
}