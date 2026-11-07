import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CSE 341 Books and Authors API",
      version: "1.0.0",
      description:
        "API documentation for managing books and authors.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
      {
        url: "https://cse341-books-vfed.onrender.com",
        description: "Production server",
      },
    ],
    components: {
      schemas: {
        Book: {
          type: "object",
          required: ["id", "authorId", "title", "publicationDate"],
          properties: {
            id: {
              type: "string",
              example: "b1",
            },
            authorId: {
              type: "string",
              example: "a1",
            },
            title: {
              type: "string",
              example: "Things Fall Apart",
            },
            publicationDate: {
              type: "string",
              format: "date",
              example: "1958-06-17",
            },
          },
        },
        Author: {
          type: "object",
          required: ["id", "name", "birthYear"],
          properties: {
            id: {
              type: "string",
              example: "a1",
            },
            name: {
              type: "string",
              example: "Chinua Achebe",
            },
            birthYear: {
              type: "integer",
              example: 1930,
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Resource not found",
            },
          },
        },
      },
    },
  },
  apis: ["./src/swaggerPaths.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;