# CodeForage Backend Documentation

This document provides an overview of the backend API endpoints, request/response formats, and usage instructions.

## Base URL
Default: `http://127.0.0.1:5000`

---

## 1. General Endpoints

### Home / Status
Checks if the API is running correctly.

- **URL:** `/`
- **Method:** `GET`
- **Response:**
  - `200 OK`: "CodeForage API is running!"

---

## 2. API Endpoints (Prefix: `/api`)

### Verify Single Email
Performs SMTP verification for a single email address.

- **URL:** `/api/verify-single`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "email": "user@example.com",
    "status": "Valid",
    "reason": "SMTP success",
    "mx_record": "mx.example.com",
    "is_free_provider": false,
    "is_role_account": false,
    "has_spf": true,
    "has_dmarc": true
  }
  ```

---

### Email Permutator
Generates variations of an email and verifies them. Supports single-name and bulk requests.

- **URL:** `/api/permutator`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`

#### **Request Body (Bulk):**
```json
{
  "domain": "company.com",
  "finds": [
    { "first_name": "John", "last_name": "Doe" },
    { "first_name": "Jane", "last_name": "Smith" }
  ]
}
```

#### **Request Body (Single):**
```json
{
  "domain": "company.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

#### **Response (Bulk):**
```json
{
  "results": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "verifications": [...]
    },
    ...
  ]
}
```

---

### Email Permutator (CSV Upload)
Processes a CSV file containing first names, last names, and company domains. Supports robust encoding (UTF-8 BOM) and flexible header mapping.

- **URL:** `/api/upload_csv`
- **Method:** `POST`
- **Headers:** `Content-Type: multipart/form-data`
- **Request Body (Form Data):**
  - `file`: (File) The `.csv` file.

#### **CSV Requirements:**
- **Supported Encodings:** UTF-8, UTF-8-sig (BOM).
- **Required Columns:** (Uses flexible mapping, ignores case/spaces)
  - `First Name` (aliases: `firstname`, `first`, `fname`)
  - `Last Name` (aliases: `lastname`, `last`, `lname`)
  - `Company/Domain` (aliases: `companyname`, `company`, `domain`, `website`, `url`)

#### **Response:**
```json
{
  "results": [
    {
      "first_name": "John",
      "last_name": "Doe",
      "domain": "google.com",
      "verifications": [...]
    },
    ...
  ]
}
```

---

### Draft Email (AI)
Extracts text from a resume PDF and generates a cold email draft using LangChain (OpenAI or Groq).

- **URL:** `/api/draft-email`
- **Method:** `POST`
- **Headers:** `Content-Type: multipart/form-data`
- **Request Body (Form Data):**
  - `resume`: (File) The PDF resume file.
  - `context`: (String) Additional context (e.g., job title, company).
  - `provider`: (String, Optional) `OpenAI` (default) or `Groq`.
  - `api_key`: (String, Optional) Direct API key (fallback to `.env`).
  - `model`: (String, Optional) Model name (e.g., `gpt-4o`, `llama-3.3-70b-versatile`).

- **Response:**
  ```json
  {
    "draft": "Subject: ... \n\n Body: ..."
  }
  ```

---

## Error Handling
All API endpoints return standard HTTP status codes:
- `200 OK`: Success
- `400 Bad Request`: Missing required fields or invalid input.
- `401 Unauthorized`: API Key missing or invalid.
- `500 Internal Server Error`: Server or LLM processing failure.

---

## Endpoint Verification Status

Last verified on: 2026-04-05

| Route Path | Method | Feature | Status |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Home / Status Check | ✅ SUCCESS (200 OK) |
| `/api/verify-single` | `POST` | SMTP Verification | ✅ SUCCESS (200 OK) |
| `/api/permutator` | `POST` | Bulk Permutator (`finds` list) | ✅ SUCCESS (200 OK) |
| `/api/upload_csv` | `POST` | CSV Bulk Permutator (Robust) | ✅ SUCCESS (200 OK) |
| `/api/draft-email` | `POST` | AI Email Drafting (PDF Upload) | ✅ SUCCESS (200 OK) |

---
***By CodeForage Team***