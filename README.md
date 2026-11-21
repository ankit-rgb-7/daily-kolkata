# Daily Kolkata

A web-based IT Helpdesk and Ticket Management System built using FastAPI, SQLite, SQLModel, HTML, CSS, and JavaScript.

## Overview

Daily Kolkata is a web application that allows users to create and manage IT support tickets. Users can register, log in, create tickets, view their tickets, and update or delete tickets they own.

## Features

- User registration and login
- Secure password hashing
- JWT-based authentication
- Create new support tickets
- View personal tickets
- View all active tickets
- Update existing tickets
- Delete tickets
- Ticket ownership verification
- Logout functionality

## Technology Stack

### Backend

- **Python** – Main programming language
- **FastAPI** – Backend framework for building APIs
- **SQLModel** – Database models and ORM
- **SQLite** – Database for storing users and tickets
- **Pydantic** – Data validation
- **Pydantic Settings** – Application configuration management
- **JWT** – Token-based authentication
- **Argon2** – Secure password hashing

### Frontend

- **HTML** – Webpage structure
- **CSS** – Styling and layout
- **JavaScript** – Frontend logic and API communication

### Tools

- **uv** – Python package and project management
- **Git** – Version control
- **GitHub** – Source code hosting

## Project Structure

```text
Daily-Kolkata/
│
├── main.py
├── models.py
├── database.py
├── auth.py
├── config.py
├── pyproject.toml
├── uv.lock
│
├── routers/
│   ├── tickets.py
│   └── users.py
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── style.css
│   ├── script.js
│   └── auth.js
│
├── .gitignore
└── README.md
```

### Understanding the Structure

- `main.py` – Starts the FastAPI application and connects the routers.
- `models.py` – Defines database models and validation schemas.
- `database.py` – Handles database connections and sessions.
- `auth.py` – Handles password hashing and JWT authentication.
- `config.py` – Loads application settings and secret key.
- `routers/` – Contains API routes for users and tickets.
- `frontend/` – Contains HTML, CSS, and JavaScript files.
- `pyproject.toml` – Defines project information and dependencies.
- `uv.lock` – Records exact resolved dependency versions.
- `.gitignore` – Specifies files that should not be uploaded to GitHub.

The `.env` file is created locally and is ignored by Git. It should never be uploaded to GitHub.

## Authentication Flow

1. A new user registers with an email and password.
2. The backend hashes the password using Argon2 before storing it in the database.
3. During login, the backend verifies the entered password.
4. If the credentials are valid, the backend generates a JWT access token.
5. The frontend stores the token in localStorage.
6. For protected requests, JavaScript sends the token in the Authorization header using the Bearer scheme.
7. FastAPI verifies the token and identifies the logged-in user before allowing access to protected routes.

The access token expires after 30 minutes.

## API Endpoints

### User Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/register` | Register a new user |
| POST | `/users/login` | Log in and receive an access token |
| GET | `/users/me` | Get the logged-in user's details |

### Ticket Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/tickets/` | Create a new ticket |
| GET | `/tickets/` | Get the logged-in user's tickets |
| GET | `/tickets/active` | Get all active tickets |
| PATCH | `/tickets/{id}` | Update a ticket |
| DELETE | `/tickets/{id}` | Delete a ticket |

## Installation and Setup

### Prerequisites

- Python 3.11 or higher
- uv package manager
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ankit-rgb-7/daily-kolkata.git
```

### 2. Navigate to the Project Folder

```bash
cd daily-kolkata
```

### 3. Install Dependencies

```bash
uv sync
```

### 4. Configure Environment Variables

Create a `.env` file in the project root directory and add:

```env
SECRET_KEY=your-secret-key
```

Generate your own secure secret key. Do not use the example value.

### 5. Run the Application

```bash
uv run fastapi dev main.py
```

Open the local URL displayed in the terminal to access the application.