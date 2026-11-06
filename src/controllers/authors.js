
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  authorHasBooks,
  deleteAuthor,
} from "../models/authors.js";

// GET all authors
export async function getAuthorsHandler(req, res) {
  try {
    const authors = await getAllAuthors();

    res.status(200).json(authors);
  } catch (error) {
    console.error("Error retrieving authors:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// GET one author by ID
export async function getAuthorByIdHandler(req, res) {
  try {
    const { id } = req.params;

    const author = await getAuthorById(id);

    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    res.status(200).json(author);
  } catch (error) {
    console.error("Error retrieving author:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}
// POST a new author
export async function createAuthorHandler(req, res) {
  try {
    const { id, name, birthYear } = req.body;

    if (
      !id ||
      typeof id !== "string" ||
      !name ||
      typeof name !== "string" ||
      birthYear === undefined ||
      !Number.isInteger(birthYear)
    ) {
      return res.status(400).json({
        message: "Please provide a valid id, name, and birthYear.",
      });
    }

    const existingAuthor = await getAuthorById(id);

    if (existingAuthor) {
      return res.status(409).json({
        message: "An author with this ID already exists.",
      });
    }

    await createAuthor({ id, name, birthYear });

    res.status(201).json({
      message: "Author created successfully.",
      author: { id, name, birthYear },
    });
  } catch (error) {
    console.error("Error creating author:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}


// PUT - Update an author
export async function updateAuthorHandler(req, res) {
  try {
    const { id } = req.params;
    const { name, birthYear } = req.body;

    if (
      !name ||
      typeof name !== "string" ||
      birthYear === undefined ||
      !Number.isInteger(birthYear)
    ) {
      return res.status(400).json({
        message: "Please provide a valid name and birthYear.",
      });
    }

    const existingAuthor = await getAuthorById(id);

    if (!existingAuthor) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    await updateAuthor(id, { name, birthYear });

    res.status(200).json({
      message: "Author updated successfully.",
      author: { id, name, birthYear },
    });
  } catch (error) {
    console.error("Error updating author:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

// DELETE - Remove an author
export async function deleteAuthorHandler(req, res) {
  try {
    const { id } = req.params;

    const existingAuthor = await getAuthorById(id);

    if (!existingAuthor) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    const hasBooks = await authorHasBooks(id);

    if (hasBooks) {
      return res.status(409).json({
        message: "Cannot delete an author who has associated books.",
      });
    }

    await deleteAuthor(id);

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting author:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}