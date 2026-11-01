import { connectToDatabase } from "../../database/connection.js";

export async function getAllBooks() {
  const db = await connectToDatabase();

  return await db.collection("books").find({}).toArray();
}