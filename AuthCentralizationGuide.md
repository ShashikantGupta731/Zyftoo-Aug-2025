# Auth Centralization Guide

## Index
1. Introduction
2. What is Auth Centralization?
3. Main Components
4. How a Login Request Flows (with Diagram)
5. How Route Protection Works (with Diagram)
6. Middleware and Role Checks (with Diagram)
7. User Roles and Permissions (with Diagram)
8. Use Case Examples
9. Where to Change What?
10. Summary
11. How the Auth System is Designed (with File References)

---

## 1. Introduction
This guide explains how authentication (auth) and admin logic is centralized in your project. It uses simple language, diagrams, and real use cases so you can understand and update the system easily.

## 2. What is Auth Centralization?
Auth centralization means all login, registration, and admin logic is handled in one place (not scattered everywhere). This makes the system more secure, easier to update, and less error-prone.

## 3. Main Components
- **Frontend**: React/Next.js with AuthContext and ProtectedRoute
- **Backend**: AuthService, AdminService, Middleware (protect, adminOnly, etc.)
- **Database**: User, Admin, and other models

## 4. How a Login Request Flows
[Insert Diagram: Login Request Flow]
- User enters credentials in the frontend
- AuthContext sends request to backend
- Backend AuthService checks user and password
- If correct, returns a token and user info
- AuthContext stores token and user info

## 5. How Route Protection Works
[Insert Diagram: Protected Route Flow]
- When a user visits a protected page, AuthContext checks if they are logged in
- If not, shows login page
- If yes, checks if they have the right role/permission
- If not, shows "Access Denied"
- If yes, shows the page

## 6. Middleware and Role Checks
[Insert Diagram: Middleware Chain]
- Every backend route can use middleware like `protect`, `adminOnly`, or `requireRoles`
- `protect` checks if the user is logged in (valid token)
- `adminOnly` checks if the user is an admin
- `requireRoles` checks for any allowed role

## 7. User Roles and Permissions
[Insert Diagram: Role/Permission Matrix]
- User: can view and update profile, place orders
- Corporate: can do everything a user can, plus bulk orders
- Admin: can manage users, products, orders, content
- SuperAdmin: can do everything

## 8. Use Case Examples
- **User Registration**: User fills signup form, AuthService creates user, sends verification email
- **Admin Creating User**: Admin uses admin panel, AdminService creates user directly
- **Corporate Bulk Order**: Corporate user logs in, accesses bulk order page
- **Permission-based Feature**: User tries to access admin feature, system checks permission

## 9. Where to Change What?
- **Add new permission**: Update permissions in AuthContext and backend RBAC
- **Create new protected route**: Use ProtectedRoute/AdminRoute in frontend, add middleware in backend
- **Add admin feature**: Use AdminService and AdminRoute
- **Modify auth logic**: Update AuthService methods
- **Change middleware**: Update authMiddleware.js

## 10. Summary
Centralized auth makes your app secure, easy to update, and scalable. Every request goes through the same checks, and you always know where to look to change something.

## 11. How the Auth System is Designed (with File References)

The authentication system is designed to be modular and centralized. Here is how the control flows for each route, with file locations for easy navigation:

### A. Login Flow
- **Frontend:**
  - `Ninico/components/context/AuthContext.js` (login function calls API)
  - `Ninico/util/apiService.js` (handles HTTP request)
- **Backend:**
  - `backend/src/routes/authRoutes.js` (route: POST /api/auth/login)
  - `backend/src/controllers/authController.js` (function: loginUser)
  - `backend/src/services/AuthService.js` (function: login)
  - `backend/src/middleware/authMiddleware.js` (protect middleware for protected routes)
- **Database:**
  - `backend/src/models/User.js` (user lookup and password check)

**Flow:**
1. Frontend calls `/api/auth/login` via `apiService.js`.
2. Route handled in `authRoutes.js` → `authController.js` (`loginUser` function).
3. `loginUser` calls `AuthService.login`.
4. `AuthService.login` checks user and password in `User.js`.
5. If valid, returns token and user info to frontend.

### B. Registration Flow
- **Frontend:**
  - `Ninico/components/context/AuthContext.js` (register function)
- **Backend:**
  - `backend/src/routes/authRoutes.js` (route: POST /api/auth/signup)
  - `backend/src/controllers/authController.js` (function: signupUser)
  - `backend/src/services/AuthService.js` (function: register)
  - `backend/src/models/User.js` (user creation)

**Flow:**
1. Frontend calls `/api/auth/signup`.
2. Route handled in `authRoutes.js` → `authController.js` (`signupUser` function).
3. `signupUser` calls `AuthService.register`.
4. `AuthService.register` creates user in `User.js` and sends verification email.

### C. Protected Route (Any Authenticated API)
- **Backend:**
  - Route file (e.g., `backend/src/routes/admin/adminRoutes.js`)
  - Uses `protect` middleware from `authMiddleware.js`
  - Controller (e.g., `adminUserController.js`)
  - Service (e.g., `AdminService.js`)

**Flow:**
1. Request hits route (e.g., `/api/admin/users` in `adminRoutes.js`).
2. `protect` middleware in `authMiddleware.js` checks JWT and attaches user.
3. Controller (e.g., `adminUserController.js`) handles logic.
4. Calls service (e.g., `AdminService.js`) for business logic.

### D. Role/Permission Checks
- **Backend:**
  - `backend/src/middleware/authMiddleware.js` (functions: adminOnly, requireRoles, adminAccess)

**Flow:**
1. After `protect`, route can use `adminOnly`, `requireRoles`, or `adminAccess`.
2. These check `req.user.role` and allow/deny access.

### E. Password Reset & Email Verification
- **Backend:**
  - `backend/src/routes/authRoutes.js` (routes: /reset-password, /verify-email/:token)
  - `backend/src/controllers/authController.js` (functions: resetPassword, verifyEmail)
  - `backend/src/services/AuthService.js` (functions: resetPassword, verifyEmail)

**Flow:**
1. Frontend calls `/api/auth/reset-password` or `/api/auth/verify-email/:token`.
2. Route handled in `authRoutes.js` → `authController.js`.
3. Controller calls `AuthService` for logic.

### F. Where to Update Each Part
- **Routes:**
  - `backend/src/routes/` (add or change endpoints)
- **Controllers:**
  - `backend/src/controllers/` (add or change request handling)
- **Services:**
  - `backend/src/services/` (add or change business logic)
- **Middleware:**
  - `backend/src/middleware/authMiddleware.js` (add or change access checks)
- **Frontend Auth Logic:**
  - `Ninico/components/context/AuthContext.js` (change login/register/logout logic)
  - `Ninico/components/auth/ProtectedRoute.js` (change route protection)

**Tip:**
- You can click on the file names above in VS Code to go directly to the file.
- Each function is named the same as in this guide for easy searching.

## Quick File Navigation Table

| Function/Feature         | File Location (clickable)                                                                 |
|-------------------------|------------------------------------------------------------------------------------------|
| Auth Context (login)    | [Ninico/components/context/AuthContext.js](../Ninico/components/context/AuthContext.js)   |
| API Service             | [Ninico/util/apiService.js](../Ninico/util/apiService.js)                                 |
| Auth Routes             | [backend/src/routes/authRoutes.js](../backend/src/routes/authRoutes.js)                   |
| Auth Controller         | [backend/src/controllers/authController.js](../backend/src/controllers/authController.js) |
| AuthService (login)     | [backend/src/services/AuthService.js](../backend/src/services/AuthService.js)             |
| Middleware (protect)    | [backend/src/middleware/authMiddleware.js](../backend/src/middleware/authMiddleware.js)   |
| User Model              | [backend/src/models/User.js](../backend/src/models/User.js)                               |
| Admin Routes            | [backend/src/routes/admin/adminRoutes.js](../backend/src/routes/admin/adminRoutes.js)     |
| Admin Controller        | [backend/src/controllers/adminUserController.js](../backend/src/controllers/adminUserController.js) |
| AdminService            | [backend/src/services/AdminService.js](../backend/src/services/AdminService.js)           |

> **Tip:** Click any file link above in VS Code to open it directly. Use `Ctrl+Shift+O` in the file to jump to functions.

---

[For diagrams, use the provided Mermaid code in the previous answer. You can export them as images and insert them into this document.]
