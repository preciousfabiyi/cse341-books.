CSE 341 – Week 02 Specification

Books and Authors API

Version 1 Specifications

Feature 1: Book CRUD Operations and Author References

Goal

Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

Data Model

Book documents will be stored in the "books" collection.

Required book fields:

- "id": string, required, custom id such as "b1"
- "authorId": string, required, references the "id" field of an author document
- "title": string, required
- "publicationDate": string, required

Books will continue to use custom string ids instead of MongoDB "_id" values for route parameters.

Relationship to Authors

Each book will identify its author with an "authorId" field. The value of "authorId" must match the custom "id" value of an existing author document.

When creating or updating a book, the API should reject the request with a "400" status code if the submitted "authorId" does not match an existing author.

Routes

GET /books

Purpose: Return all books.

Success:

- Status code: "200"
- Response body: an array of book objects

Errors:

- "500" if an unexpected server or database error occurs

GET /books/:id

Purpose: Return one book by its custom id.

Success:

- Status code: "200"
- Response body: the matching book object

Errors:

- "404" if no book exists with that id
- "500" if an unexpected server or database error occurs

POST /books

Purpose: Create a new book.

Request body:

{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}

Success:

- Status code: "201"
- Response body: the newly created book object

Errors:

- "400" if a required field is missing
- "400" if the "id" already exists
- "400" if the "authorId" does not match an existing author
- "500" if an unexpected server or database error occurs

PUT /books/:id

Purpose: Update an existing book.

Request body:

{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}

Success:

- Status code: "200"
- Response body: the updated book object

Errors:

- "400" if a required field is missing
- "400" if the "authorId" does not match an existing author
- "404" if no book exists with that id
- "500" if an unexpected server or database error occurs

DELETE /books/:id

Purpose: Delete an existing book.

Success:

- Status code: "204"
- Response body: none

Errors:

- "404" if no book exists with that id
- "500" if an unexpected server or database error occurs

Swagger Documentation

Swagger must document every book route.

Deployment Expectations

After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at "/api-docs" must allow someone to test every book route from the browser.

---

Feature 2: Author CRUD Operations

Goal

Create an authors API that supports creating, retrieving, updating, and deleting author records. Authors will be stored in a MongoDB collection named "authors".

Data Model

Author documents will be stored in the "authors" collection.

Required author fields:

- "id": string, required, custom ID such as "a1"
- "name": string, required
- "birthYear": number, required

Example author document:

{
  "id": "a1",
  "name": "Chinua Achebe",
  "birthYear": 1930
}

Authors will use custom string IDs instead of MongoDB "_id" values for route parameters.

Routes

GET /authors

Purpose: Return all authors.

Success:

- Status code: "200"
- Response body: an array of author objects

Errors:

- "500" if an unexpected server or database error occurs

GET /authors/:id

Purpose: Return one author by their custom ID.

Success:

- Status code: "200"
- Response body: the matching author object

Errors:

- "404" if no author exists with that ID
- "500" if an unexpected server or database error occurs

POST /authors

Purpose: Create a new author.

Request body:

{
  "id": "a4",
  "name": "Wole Soyinka",
  "birthYear": 1934
}

Success:

- Status code: "201"
- Response body: the newly created author object

Errors:

- "400" if a required field is missing or invalid
- "400" if the author ID already exists
- "500" if an unexpected server or database error occurs

PUT /authors/:id

Purpose: Update an existing author.

Request body:

{
  "name": "Updated Author Name",
  "birthYear": 1940
}

Success:

- Status code: "200"
- Response body: the updated author object

Errors:

- "400" if a required field is missing or invalid
- "404" if no author exists with that ID
- "500" if an unexpected server or database error occurs

DELETE /authors/:id

Purpose: Delete an existing author.

Success:

- Status code: "204"
- Response body: none

Errors:

- "404" if no author exists with that ID
- "409" if the author still has books associated with them
- "500" if an unexpected server or database error occurs

Relationship to Books

Each book must reference an existing author through its "authorId" field.

When deleting an author, the API must check whether any books still reference that author. If books are associated with the author, the API must reject the deletion with status code "409 Conflict".

This prevents books from being left with references to authors that no longer exist.

Swagger Documentation

Swagger must document every author route, including request bodies, path parameters, response status codes, and possible errors.

Deployment Expectations

After implementation, all author routes must work locally and from the deployed Render application. The deployed Swagger page at "/api-docs" must allow someone to test every author route from the browser.

---

Evaluation of Version 1

After reviewing the Version 1 specifications, I identified some areas that needed clarification and improvement.

1. Bugs or short-sighted decisions

- The publication date should have a clearly defined format.
- The API should validate all required fields before inserting or updating documents.
- The API should prevent duplicate custom IDs.
- Books should not reference authors that do not exist.
- Authors should not be deleted while books still reference them.
- PUT should require all fields that belong to the resource being updated.

2. Security considerations

- MongoDB connection strings and credentials should be stored in environment variables.
- The actual ".env" file must not be committed to GitHub.
- Error responses should not expose database credentials, stack traces, or internal database details.
- User input should be validated before it is used in database operations.

3. Efficiency concerns

- Database queries should search using the custom "id" field.
- MongoDB should have unique indexes on custom IDs to prevent duplicate records.
- The API should retrieve only the fields required by the application.
- The database should check author references efficiently before creating or updating books.

4. Unclear response examples and error behaviors

- The specifications should include examples of successful responses.
- The API should return clear messages when a book or author does not exist.
- Duplicate IDs should return a consistent conflict response.
- Unexpected errors should return a safe general error message.
- Deleting an author with associated books should return "409 Conflict".

---

Version 2 Specifications

Feature 1: Book CRUD Operations and Author References

Goal

Build a complete Books API using Express and MongoDB. The API must support creating, retrieving, updating, and deleting books. Each book must reference an existing author through the author's custom ID.

Database

Database name: "cse341-books-db"

Collection name: "books"

Data Model

Each book must contain:

- "id": string, required, unique custom ID such as "b1".
- "authorId": string, required, references an existing author's custom ID.
- "title": string, required.
- "publicationDate": string, required, formatted as "YYYY-MM-DD".

Example:

{
  "id": "b1",
  "authorId": "a1",
  "title": "Things Fall Apart",
  "publicationDate": "1958-06-17"
}

MongoDB will automatically generate its "_id" field, but the API will use the custom "id" field for its route parameters.

Relationship to Authors

- Each book must reference an existing author.
- The "authorId" must match an author's custom "id".
- When creating or updating a book, the API must verify that the author exists.
- If the author does not exist, return "400 Bad Request".
- Deleting an author must not leave books with invalid references.

Routes

GET /books

Purpose: Retrieve all books.

Success:

- "200 OK"
- Return an array of book documents.

Example:

[
  {
    "id": "b1",
    "authorId": "a1",
    "title": "Things Fall Apart",
    "publicationDate": "1958-06-17"
  }
]

Errors:

- "500 Internal Server Error" if an unexpected error occurs.

GET /books/:id

Purpose: Retrieve a single book using its custom ID.

Success:

- "200 OK"
- Return the matching book.

Errors:

- "404 Not Found" if the book does not exist.
- "500 Internal Server Error" if an unexpected error occurs.

Not-found response:

{
  "message": "Book not found"
}

POST /books

Purpose: Create a new book.

Request body:

{
  "id": "b4",
  "authorId": "a1",
  "title": "The New Book",
  "publicationDate": "2026-01-15"
}

Success:

- "201 Created"
- Return the newly created book.

Errors:

- "400 Bad Request" if a required field is missing or invalid.
- "400 Bad Request" if the author does not exist.
- "409 Conflict" if the custom book ID already exists.
- "500 Internal Server Error" for unexpected errors.

PUT /books/:id

Purpose: Replace the editable fields of an existing book.

Request body:

{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}

Success:

- "200 OK"
- Return the updated book.

Errors:

- "400 Bad Request" if a required field is missing or invalid.
- "400 Bad Request" if the referenced author does not exist.
- "404 Not Found" if the book does not exist.
- "500 Internal Server Error" for unexpected errors.

The custom book ID in the URL must not be changed by the request body.

DELETE /books/:id

Purpose: Delete a book using its custom ID.

Success:

- "204 No Content"
- Return no response body.

Errors:

- "404 Not Found" if the book does not exist.
- "500 Internal Server Error" for unexpected errors.

Validation and Error Handling

- Validate all required fields.
- Validate that publication dates use the "YYYY-MM-DD" format and represent valid dates.
- Prevent duplicate custom IDs.
- Confirm that referenced authors exist.
- Do not expose database errors or stack traces to clients.
- Use safe and understandable error messages.

Swagger Documentation

Every book route must have complete Swagger documentation, including:

- Route descriptions.
- HTTP methods.
- Required path parameters.
- Request body schemas for POST and PUT.
- Successful response examples.
- Error response codes and examples.

All routes must be testable through Swagger UI at "/api-docs".

Deployment Expectations

The completed API must work locally and on Render. All book routes must be tested using Swagger UI in both environments.

---

Feature 2: Author CRUD Operations

Goal

Create a complete Authors API using Express and MongoDB. The API must support creating, retrieving, updating, and deleting author records.

Database

Database name: "cse341-books-db"

Collection name: "authors"

Data Model

Each author must contain:

- "id": string, required, unique custom ID such as "a1".
- "name": string, required.
- "birthYear": number, required, representing a valid year.

Example:

{
  "id": "a1",
  "name": "Chinua Achebe",
  "birthYear": 1930
}

MongoDB will automatically generate its "_id" field, but the API will use the custom "id" field for its route parameters.

Routes

GET /authors

Purpose: Retrieve all authors.

Success:

- "200 OK"
- Return an array of author documents.

Example:

[
  {
    "id": "a1",
    "name": "Chinua Achebe",
    "birthYear": 1930
  }
]

Errors:

- "500 Internal Server Error" if an unexpected error occurs.

GET /authors/:id

Purpose: Retrieve one author using their custom ID.

Success:

- "200 OK"
- Return the matching author.

Errors:

- "404 Not Found" if the author does not exist.
- "500 Internal Server Error" for unexpected errors.

Not-found response:

{
  "message": "Author not found"
}

POST /authors

Purpose: Create a new author.

Request body:

{
  "id": "a4",
  "name": "Wole Soyinka",
  "birthYear": 1934
}

Success:

- "201 Created"
- Return the newly created author.

Errors:

- "400 Bad Request" if a required field is missing or invalid.
- "409 Conflict" if the custom author ID already exists.
- "500 Internal Server Error" for unexpected errors.

PUT /authors/:id

Purpose: Replace the editable fields of an existing author.

Request body:

{
  "name": "Updated Author Name",
  "birthYear": 1940
}

Success:

- "200 OK"
- Return the updated author.

Errors:

- "400 Bad Request" if a required field is missing or invalid.
- "404 Not Found" if the author does not exist.
- "500 Internal Server Error" for unexpected errors.

The custom author ID in the URL must not be changed by the request body.

DELETE /authors/:id

Purpose: Delete an author using their custom ID.

Before deleting an author, the API must check whether any books reference the author's ID.

Success:

- "204 No Content"
- Return no response body.

Errors:

- "404 Not Found" if the author does not exist.
- "409 Conflict" if books are still associated with the author.
- "500 Internal Server Error" for unexpected errors.

Conflict response:

{
  "message": "Cannot delete author because books are associated with this author"
}

Validation and Error Handling

- Validate all required fields.
- The author ID must be unique.
- The name must be a non-empty string.
- The birth year must be a valid integer year.
- Prevent deletion of authors who still have associated books.
- Do not expose database errors or stack traces to clients.
- Return clear and safe error messages.

Swagger Documentation

Every author route must have complete Swagger documentation, including:

- Route descriptions.
- HTTP methods.
- Required path parameters.
- Request body schemas for POST and PUT.
- Successful response examples.
- Error response codes and examples.

All author routes must be testable through Swagger UI at "/api-docs".

Deployment Expectations

The completed Authors API must work locally and on Render. All author routes must be tested using Swagger UI in both environments.

---

General Implementation Requirements

1. Use Node.js and Express for the API.
2. Use MongoDB for database storage.
3. Use environment variables for database credentials.
4. Keep the ".env" file out of GitHub using ".gitignore".
5. Organize the application using routes, controllers, and models.
6. Use custom string IDs for books and authors.
7. Document all routes using Swagger/OpenAPI.
8. Test successful requests and error cases.
9. Use GitHub issues, branches, and pull requests to track implementation.
10. Deploy the completed application to Render.

Out of Scope

- User authentication and authorization.
- User registration and login.
- Uploading book cover images.
- Advanced search and filtering.
- Pagination.