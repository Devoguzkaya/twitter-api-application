# Twitter Clone API (Full Stack)

A full-stack social media application built with **Spring Boot** (Backend) and **React** (Frontend).
The project is primarily focused on **clean RESTful API design, backend architecture, and real-world business logic**, supported by a lightweight but functional frontend.

This repository demonstrates **secure authentication**, **role-based authorization**, **DTO-driven data exposure**, and **scalable backend patterns**, along with a modern React-based UI to showcase API functionality.

---

## Highlights of Recent Improvements

- **Enhanced Frontend Architecture**
  - Introduced `AuthContext` for global authentication and role management
  - Refactored `TweetList` into reusable `TweetItem` components

- **Optimistic UI Updates**
  - Like and Retweet actions provide instant visual feedback before server response

- **Robust Error Handling**
  - Backend: `GlobalExceptionHandler` for consistent and meaningful API errors
  - Frontend: `react-toastify` for user-friendly notifications (e.g. duplicate username, unauthorized actions)

- **Feed Pagination**
  - Main tweet feed supports pagination to avoid heavy data loading and improve performance

- **Extended Test Coverage**
  - Backend unit and integration tests cover validation errors, authorization rules, and edge cases

- **Codebase Cleanup**
  - Removed unnecessary comments
  - Fixed Turkish character encoding issues
  - Improved overall readability and maintainability

---

## Features

### Backend (Spring Boot)

#### Authentication & Security

- Secure user registration and login
- Role-Based Access Control (RBAC) with `USER` and `ADMIN` roles
- HTTP Basic Authentication with BCrypt password hashing

#### Tweet Management

- Create, Read, Update, Delete (CRUD) tweets
- Feed endpoint supports **pagination**
- Feed sorting based on creation time and retweet count

#### Social Interactions

- **Like / Dislike**
  - Toggle-based system with duplicate prevention
  - Backend returns `liked` status for the current user
- **Retweet**
  - Retweet with self-retweet prevention
  - Backend returns `isRetweeted` status for the current user
- **Comments**
  - Add, update, and delete comments (CRUD)

#### User Profiles

- View user profiles including their tweets and retweets

#### Admin Panel

- Admin-only endpoints and UI to list and manage users

#### Architecture & Design

- Layered architecture: Controller, Service, Repository, Entity
- DTO Pattern to prevent direct entity exposure and protect sensitive data
- Global exception handling for validation, authorization, and business rule violations

---

### Frontend (React + Vite)

- Built as a **demonstrative UI** to interact with and showcase backend capabilities
- Modular component design with reusable tweet and comment components
- Global state management using **React Context API (`AuthContext`)**
- Responsive UI using **Tailwind CSS**
- Real-time counters with **Optimistic UI updates**
- Inline tweet and comment editing
- Dropdown menus for tweet and comment actions
- Notifications via **react-toastify**
- SPA navigation with React Router DOM
- Protected routes for Admin-only views

---

## Tech Stack

### Backend

- **Language:** Java 17
- **Framework:** Spring Boot 3.x (Web, Data JPA, Security, Validation)
- **Database:** PostgreSQL
- **Build Tool:** Maven
- **Testing:** JUnit 5, Mockito

### Frontend

- **Library:** React 19
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Hooks & Context API
- **HTTP Client:** Axios

---

## Project Structure

This project is organized as a **monorepo** containing both backend and frontend applications:

```text
twitter-api-application/
├── twitter-api-backend/    # Spring Boot Application
│   ├── src/
│   ├── mvnw
│   └── pom.xml
└── twitter-api-frontend/   # React Application
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js & npm
- PostgreSQL (running on port 5432, database named `twitter`)

### 1. Backend Setup

Navigate to the backend directory:

```bash
cd twitter-api-backend
```

Configure your database in `src/main/resources/application.properties` if needed.

Run the application:

```bash
# Windows
./mvnw spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

The backend will start on `http://localhost:3000`.

#### Admin User Setup

To grant ADMIN privileges to a user:

1. Register a new user with the username "admin" (or any desired username for the admin).
2. After registration, execute the following SQL command in your PostgreSQL client (e.g., pgAdmin, psql) to assign the `ADMIN` role to this user:

   ```sql
   INSERT INTO public.user_role (user_id, role_id)
   SELECT u.id, r.id
   FROM user_account u, app_role r
   WHERE u.username = 'admin' AND r.authority = 'ADMIN'
   ON CONFLICT (user_id, role_id) DO NOTHING;
   ```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd twitter-api-frontend
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:3200`.

## Testing

The backend includes unit and integration tests. To run them:

```bash
cd twitter-api-backend
./mvnw clean test
```

## Author

**Oğuzhan KAYA**

- GitHub: [https://github.com/Devoguzkaya](https://github.com/Devoguzkaya)
