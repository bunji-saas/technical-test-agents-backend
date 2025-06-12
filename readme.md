# Agent API

A simple Express-based API for managing agents. All endpoints require an API token in the `x-api-token` header.

## Base URL

```
http://localhost:3040
```

## Authentication

All requests must include the following header:

```
x-api-token: your-secret-api-token
```

---

## Endpoints

### Create Agent

- **POST** `/agents`
- **Headers:** `x-api-token: your-secret-api-token`
- **Body:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string|null"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string|null",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
  ```
- **Errors:**
  - `400 Bad Request` if body is missing or invalid
  - `401 Unauthorized` if token is missing/invalid

---

### Update Agent

- **PATCH** `/agents/:id`
- **Headers:** `x-api-token: your-secret-api-token`
- **Body:** (any of the following fields, all optional)
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string|null"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string|null",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
  ```
- **Errors:**
  - `400 Bad Request` if body is missing or invalid
  - `401 Unauthorized` if token is missing/invalid
  - `404 Not Found` if agent does not exist

---

### Delete Agent

- **DELETE** `/agents/:id`
- **Headers:** `x-api-token: your-secret-api-token`
- **Response:** `204 No Content`
- **Errors:**
  - `401 Unauthorized` if token is missing/invalid
  - `404 Not Found` if agent does not exist

---

### List Agents (Paginated)

- **GET** `/agents?page=1`
- **Headers:** `x-api-token: your-secret-api-token`
- **Query Params:**
  - `page` (optional, default: 1)
- **Response:** `200 OK`
  ```json
  {
    "data": [
      {
        "id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string|null",
        "createdAt": "string (ISO date)",
        "updatedAt": "string (ISO date)"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10
  }
  ```
- **Errors:**
  - `401 Unauthorized` if token is missing/invalid

---

## Agent Object

| Field      | Type           | Description           |
|------------|----------------|----------------------|
| id         | string         | Unique agent ID      |
| firstName  | string         | Agent's first name   |
| lastName   | string         | Agent's last name    |
| email      | string \| null | Agent's email        |
| createdAt  | string         | ISO date created     |
| updatedAt  | string         | ISO date updated     |

---

## Notes
- All dates are in ISO 8601 format.
- Pagination returns 10 agents per page.
- All endpoints require authentication.
