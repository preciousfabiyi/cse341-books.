import { MongoClient } from "mongodb";

let client;
let database;

export async function connectToDatabase() {
  if (database) {
    return database;
  }

  const connectionString = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DB_NAME;

  if (!connectionString || !databaseName) {
    throw new Error(
      "MONGODB_URI and MONGODB_DB_NAME must be configured."
    );
  }

  client = new MongoClient(connectionString);

  await client.connect();

  database = client.db(databaseName);

  console.log("Successfully connected to MongoDB!");

  return database;
}