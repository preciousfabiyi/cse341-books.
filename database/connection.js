import { MongoClient } from "mongodb";

let database;

export async function connectToDatabase() {
  if (database) {
    return database;
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  await client.connect();

  database = client.db("cse341-books-db");

  console.log("Successfully connected to MongoDB!");

  return database;
}