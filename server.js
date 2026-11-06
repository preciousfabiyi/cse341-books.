import express from "express";
import { connectToDatabase } from "./database/connection.js";
import router from "./src/router.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to read JSON request bodies
app.use(express.json());

// Register application routes
app.use(router);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the CSE 341 Books Web Service!",
  });
});

async function startServer() {
  try {
    await connectToDatabase();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();