This Swagger (OpenAPI 3.0) documentation describes
The **Authentication** and **Items** modules for the MyHostel API.
It is designed as a **pre-task documentation-only deliverable**, without any backend implementation.

## Design Decisions

### 1. OpenAPI Version

- **Version:** 3.0.0
- Chosen because it is **widely supported** and allows defining **components, security schemes, examples, and validations** clearly.

### 2. API Info Section

- **Title, Version, Description, Author Name** included to satisfy the requirements.
- Contact name included for clarity in submission.

### 3. Servers

- Base URL: `http://localhost:3000/api`
- Represents the **local development server** for future backend testing.

### 4. Authentication Module (`/api/auth`)

- Endpoints included:

  - `POST /auth/register` → user registration
  - `POST /auth/login` → login
  - `GET /auth/my-profile` → protected user profile

### 5. Items Module (`/api/items`)

- Endpoints included:

  - `GET /items` → get all items of authenticated user
  - `GET /items/{id}` → get a single item if owned
  - `POST /items` → create item (title required)
  - `PUT /items/{id}` → update item if owned
  - `DELETE /items/{id}` → delete item if owned


### 6. Components & Validation

- **Schemas** defined for:

  - `RegisterRequest`, `LoginRequest`, `TokenResponse`, `UserProfile`
  - `ItemRequest`, `Item`
  - `ErrorResponse` for standardized error messages

- Validations included:

  - Required fields
  - Types (string, email format)
  - `minLength` for passwords


### 7. Error Responses

- Explicit examples included for:

  - 400 Bad Request
  - 401 Unauthorized
  - 404 Not Found
  - 409 Conflict

### 8. Reasoning

- **Documentation-first approach**: Focused on **API contract** before implementation.
- **Clarity and completeness**: Ensures every endpoint, field, and possible response is described.
- **Scalable**: JWT security scheme allows easy extension to future modules.
- **Reviewer-friendly**: Examples clearly show expected requests and responses for success and error cases.

### Notes for Reviewer

- This YAML **does not execute actual API calls**; it is purely documentation.
- “Try it out” in Swagger Editor shows **example responses**, not real server-generated responses.
- Backend implementation can follow this specification exactly, without ambiguity.
