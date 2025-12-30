# PROJECT_MEMORY.md
> **Project Name:** Twitter API (FSWEB-s19-Challenge)
> **Last Updated:** 2025-12-30
> **Current Phase:** Final Polish & Deployment Preparation
> **Active Context:** Codebase cleanup, Refactoring, Documentation, Dockerization.

---

## [1. PROJECT VISION & GOALS]
* **Core Concept:** Twitter-like REST API with secured tweet/comment/like/retweet features and a modern React client.
* **Target Audience:** Portfolio reviewers, technical recruiters.
* **Success Criteria:** Clean Architecture, N+1 problem solved, Pagination, Optimistic UI, Full Test Coverage, Docker support.

## [2. TECH STACK & CONSTRAINTS]
* **Language/Framework:** Java 17, Spring Boot 3.x, React 19.
* **Backend/DB:** Spring Data JPA, PostgreSQL (Docker ready).
* **Frontend:** React (Vite), Tailwind CSS, Context API, React Toastify.
* **Architecture:** Monorepo (Backend/Frontend separate directories).
* **Key Packages:** Spring Security, Validation, Lombok.

## [3. ARCHITECTURE & PATTERNS]
* **Backend:**
    *   **Layered Architecture:** Controller -> Service -> Repository.
    *   **Logic in Service:** Controllers are thin ("Traffic Cops"), business logic resides in Services.
    *   **DTOs:** Explicit Request/Response objects. No Entity exposure.
    *   **Pagination:** Database-level pagination using `Pageable`.
    *   **Optimization:** User fetching optimized in DTO conversion to prevent N+1 queries.
*   **Frontend:**
    *   **Component-Based:** Reusable `TweetItem`, `Layout`, `Sidebar`.
    *   **Context API:** `AuthContext` for global auth state and API URL management.
    *   **Optimistic UI:** Instant feedback for user actions.

## [4. ACTIVE RULES (The "Laws")]
1.  **No Logic in Controller:** Move all business logic (validation, sorting, entity creation) to Service layer.
2.  **Performance First:** Avoid N+1 queries. Use Pagination.
3.  **Secure by Default:** All endpoints (except auth) require authentication. Password min length 8.
4.  **Clean Code:** No verbose comments. Constants for Roles. English error messages.
5.  **User Experience:** Use Toast notifications, not alerts. Handle errors gracefully.

## [5. PROGRESS & ROADMAP]
- [x] Phase 1: Setup & Configuration (Entities, Security)
- [x] Phase 2: Core Features (CRUD for Tweet, Comment, Like, Retweet)
- [x] Phase 3: Frontend Integration (React, Tailwind, Auth)
- [x] Phase 4: Advanced Features
    - [x] Pagination support for Feed.
    - [x] Like/Retweet Toggle with correct backend state (`liked`, `isRetweeted`).
    - [x] Edit/Delete functionality with Dropdown menus.
    - [x] Admin Panel with role-based access.
- [x] Phase 5: Refactoring & Optimization
    - [x] Service Layer Refactor (N+1 fix, User fetching optimization).
    - [x] Controller Cleanup (Logic moved to Service).
    - [x] Codebase Cleanup (Removed comments, fixed encoding).
    - [x] Frontend Refactor (Split `TweetList` to `TweetItem`).
- [x] Phase 6: Testing & Deployment Prep
    - [x] Expanded Unit/Integration Tests.
    - [x] Dockerfile creation.
    - [x] Dynamic API URL configuration.
    - [x] Final Documentation (`README.md`, `ozet.txt`).

## [6. DECISION LOG]
*   **[Decision - Auth]:** Used Basic Auth for simplicity in this scope, but structured code to allow easy switch to JWT.
*   **[Decision - State]:** Switched from Prop Drilling to Context API (`AuthContext`) for better state management in Frontend.
*   **[Decision - UI]:** Implemented Optimistic Updates for Like/Retweet to improve perceived performance.
*   **[Decision - Backend]:** Added `retweetCount`, `liked`, `isRetweeted` fields to `TweetResponse` to support UI requirements directly from backend.
*   **[Decision - Error Handling]:** Centralized error messages in `GlobalExceptionHandler` and translated to English for consistency.

---
**OPERATIONAL DIRECTIVE:**
This file represents the final state of the project development memory.
