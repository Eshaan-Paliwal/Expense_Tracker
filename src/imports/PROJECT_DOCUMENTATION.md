# MERN Expense Tracker - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Backend Components](#backend-components)
6. [Frontend Components](#frontend-components)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Features & Functionality](#features--functionality)
10. [User Authentication Flow](#user-authentication-flow)
11. [Expense Management Flow](#expense-management-flow)
12. [Setup & Installation](#setup--installation)
13. [Environment Configuration](#environment-configuration)

---

## Project Overview

**MERN Expense Tracker** is a full-stack web application built using the MERN (MongoDB, Express, React, Node.js) stack. It allows users to:

- Create an account and log in securely
- Track income and expenses
- View expense summary with running balance
- Add new income/expense entries
- Delete expense entries
- View real-time calculations of total income, expenses, and balance

The application provides a user-friendly interface for personal financial management with secure JWT-based authentication.

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  (Login → Signup → Home → Expense Management)               │
└────────────────────┬────────────────────────────────────────┘
                     │ (HTTP/REST API)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Backend (Express.js)                        │
│  (Routes → Controllers → Models → Database)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│               MongoDB Database                               │
│  (Users Collection with Embedded Expenses)                  │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Input → Frontend Validation → API Call → Backend Validation 
→ JWT Generation/Verification → Database Operation → Response
```

---

## Technology Stack

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web framework for building REST APIs
- **MongoDB**: NoSQL database for data persistence
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB
- **JWT (jsonwebtoken)**: For secure user authentication
- **Bcrypt**: For secure password hashing
- **Joi**: Schema validation library
- **Body-parser**: Middleware for parsing request bodies
- **CORS**: Cross-Origin Resource Sharing middleware
- **Dotenv**: Environment variable management

### Frontend
- **React**: UI library for building user interfaces
- **React Router DOM**: Client-side routing
- **React Toastify**: Toast notifications for user feedback
- **CSS**: Styling the application

---

## Project Structure

```
MERN-Expense-Tracker/
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.js       # Authentication logic
│   │   └── ExpenseController.js    # Expense management logic
│   ├── Middlewares/
│   │   ├── Auth.js                 # JWT verification middleware
│   │   └── AuthValidation.js       # Input validation schemas
│   ├── Models/
│   │   ├── db.js                   # MongoDB connection
│   │   └── User.js                 # User schema with expenses
│   ├── Routes/
│   │   ├── AuthRouter.js           # Authentication routes
│   │   ├── ExpenseRouter.js        # Expense routes
│   │   └── ProductRouter.js        # Product routes (reference)
│   ├── index.js                    # Main server file
│   ├── package.json                # Backend dependencies
│   └── vercel.json                 # Deployment config
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js            # Login page
│   │   │   ├── Signup.js           # Registration page
│   │   │   ├── Home.js             # Main dashboard
│   │   │   ├── ExpenseForm.js      # Add expense form
│   │   │   ├── ExpenseTable.js     # Display expenses list
│   │   │   └── ExpenseDetails.js   # Summary display
│   │   ├── App.js                  # Main app component with routing
│   │   ├── App.css                 # Global styles
│   │   ├── index.js                # React DOM entry point
│   │   ├── utils.js                # Helper functions
│   │   ├── RefrshHandler.js        # Session persistence
│   │   └── setupTests.js           # Test configuration
│   ├── package.json                # Frontend dependencies
│   ├── vercel.json                 # Deployment config
│   └── README.md
│
└── README.md                        # Project README
```

---

## Backend Components

### 1. **Models** - Data Structure

#### User.js
Defines the MongoDB schema for users with embedded expenses.

**Schema Fields:**
- `name` (String, Required): User's full name (3-100 characters)
- `email` (String, Required, Unique): User's email address
- `password` (String, Required): Hashed password
- `expenses` (Array): Array of expense objects
  - `text` (String, Required): Description of expense
  - `amount` (Number, Required): Amount (positive for income, negative for expense)
  - `createdAt` (Date): Timestamp of creation (defaults to current date)

**Example User Document:**
```json
{
  "_id": "ObjectId",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$hashedpassword",
  "expenses": [
    {
      "_id": "ObjectId",
      "text": "Salary",
      "amount": 50000,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "ObjectId",
      "text": "Groceries",
      "amount": -500,
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

#### db.js
Handles MongoDB connection using Mongoose.
- Connects to MongoDB using the `MONGO_CONN` environment variable
- Provides connection success/error logging

### 2. **Controllers** - Business Logic

#### AuthController.js

**signup()**
- **Purpose**: Register a new user
- **Process**:
  1. Receives name, email, password from request body
  2. Checks if user already exists by email
  3. Returns error if user exists (409 Conflict)
  4. Hashes password using bcrypt with salt rounds = 10
  5. Creates new user document in database
  6. Returns success response (201 Created)
- **Error Handling**: Catches and returns 500 Internal Server Error

**login()**
- **Purpose**: Authenticate user and generate JWT token
- **Process**:
  1. Receives email and password
  2. Finds user by email in database
  3. Compares provided password with hashed password using bcrypt
  4. If credentials invalid, returns 403 Forbidden
  5. Generates JWT token with user email and ID
  6. Token expires in 24 hours
  7. Returns success response with token, email, and user name
- **Error Handling**: Catches and returns 500 Internal Server Error

#### ExpenseController.js

**addTransaction()**
- **Purpose**: Add a new expense/income entry
- **Process**:
  1. Extracts user ID from JWT token (req.user._id)
  2. Receives expense data (text, amount) from request body
  3. Uses MongoDB `$push` operator to add expense to user's expenses array
  4. Returns updated expenses list with 200 OK status
- **Authentication**: Requires valid JWT token

**getAllTransactions()**
- **Purpose**: Retrieve all expenses for logged-in user
- **Process**:
  1. Extracts user ID from JWT token
  2. Queries MongoDB to find user by ID
  3. Uses `.select('expenses')` to retrieve only expenses field
  4. Returns expenses array with 200 OK status
- **Authentication**: Requires valid JWT token

**deleteTransaction()**
- **Purpose**: Delete an expense entry
- **Process**:
  1. Extracts user ID from JWT token
  2. Gets expense ID from URL parameter (req.params.expenseId)
  3. Uses MongoDB `$pull` operator to remove expense from array
  4. Returns updated expenses list with 200 OK status
- **Authentication**: Requires valid JWT token

### 3. **Middlewares** - Interceptors & Validators

#### Auth.js (Authentication Middleware)
```javascript
ensureAuthenticated(req, res, next)
```
- **Purpose**: Verify JWT token for protected routes
- **Process**:
  1. Retrieves authorization header from request
  2. Returns 403 if no token provided
  3. Verifies token using `jwt.verify()` with JWT_SECRET
  4. If valid: Attaches decoded user data to `req.user`
  5. Calls `next()` to proceed to route handler
  6. If invalid/expired: Returns 403 Forbidden
- **Applied To**: All expense routes (`/expenses/*`)

#### AuthValidation.js (Input Validation)

**signupValidation()**
- Validates signup request body using Joi schema
- Requirements:
  - `name`: String, 3-100 characters, required
  - `email`: Valid email format, required
  - `password`: String, 4-100 characters, required
- Returns 400 Bad Request if validation fails

**loginValidation()**
- Validates login request body using Joi schema
- Requirements:
  - `email`: Valid email format, required
  - `password`: String, 4-100 characters, required
- Returns 400 Bad Request if validation fails

### 4. **Routes** - API Endpoints

#### AuthRouter.js
```
POST /auth/signup     - Register new user
POST /auth/login      - Authenticate user
```

#### ExpenseRouter.js
```
GET    /expenses      - Get all expenses (Protected)
POST   /expenses      - Add new expense (Protected)
DELETE /expenses/:id  - Delete expense (Protected)
```

#### ProductRouter.js (Reference/Demo)
```
GET /products         - Get products list (Protected)
```

#### Main Server (index.js)
```
GET /ping             - Health check endpoint
```

### 5. **Server Configuration** (index.js)

- **Port**: Configurable via PORT environment variable (default: 8080)
- **Middleware Stack**:
  1. Body-parser (JSON)
  2. CORS (Cross-Origin Resource Sharing)
- **Route Mounting**:
  - `/auth` → AuthRouter (signup, login)
  - `/products` → ProductRouter (protected)
  - `/expenses` → ExpenseRouter (protected with Auth middleware)
- **Database**: Connected via Models/db.js on startup

---

## Frontend Components

### 1. **Page Components**

#### Login.js
**Purpose**: User authentication page

**State Management:**
- `loginInfo`: Object containing email and password
```javascript
{
  email: '',
  password: ''
}
```

**Functionality:**
- Email and password input fields
- Form validation (ensures both fields filled)
- API call to `/auth/login` endpoint
- On success:
  - Stores JWT token in localStorage
  - Stores user name in localStorage
  - Navigates to `/home` after 1 second
- On error: Displays toast notification with error message
- Link to signup page for new users

**UI Elements:**
- Email input field
- Password input field
- Submit button
- Link to signup
- Toast notification container

#### Signup.js
**Purpose**: New user registration page

**State Management:**
- `signupInfo`: Object containing name, email, and password
```javascript
{
  name: '',
  email: '',
  password: ''
}
```

**Functionality:**
- Name, email, and password input fields
- Form validation (ensures all fields filled)
- API call to `/auth/signup` endpoint
- On success:
  - Shows success toast
  - Navigates to `/login` after 1 second
- On error: Displays toast notification with error message
- Link to login page for existing users

**UI Elements:**
- Name input field
- Email input field
- Password input field
- Submit button
- Link to login
- Toast notification container

#### Home.js
**Purpose**: Main dashboard and expense management hub

**State Management:**
- `loggedInUser`: String - displays currently logged-in user's name
- `expenses`: Array - list of all user expenses
- `incomeAmt`: Number - total income across all expenses
- `expenseAmt`: Number - total expenses (absolute value)

**Key Functions:**

1. **handleLogout()**
   - Removes JWT token from localStorage
   - Removes user name from localStorage
   - Shows success toast
   - Navigates to login page

2. **fetchExpenses()**
   - API call to `GET /expenses`
   - Includes JWT token in Authorization header
   - On 403: Clears token and redirects to login
   - Updates expenses state with fetched data
   - Called on component mount

3. **addTransaction(data)**
   - API call to `POST /expenses`
   - Sends expense object (text, amount)
   - Includes JWT token in Authorization header
   - On 403: Clears token and redirects to login
   - Updates expenses state with response data
   - Shows success toast

4. **deleteExpens(id)**
   - API call to `DELETE /expenses/{id}`
   - Includes JWT token in Authorization header
   - On 403: Clears token and redirects to login
   - Updates expenses state with response data
   - Shows success toast

5. **Income/Expense Calculation (useEffect)**
   - Separates expenses by amount sign:
     - Positive amounts = Income
     - Negative amounts = Expense
   - Calculates totals using reduce function
   - Updates `incomeAmt` and `expenseAmt` state

**Rendered Child Components:**
- `ExpenseDetails`: Displays balance summary
- `ExpenseForm`: Form to add new expense
- `ExpenseTable`: List of all expenses

#### ExpenseForm.js
**Purpose**: Form component to add new income/expense entries

**State Management:**
- `expenseInfo`: Object containing amount and text
```javascript
{
  amount: '',
  text: ''
}
```

**Functionality:**
- Form with two input fields:
  - `text`: Description of expense
  - `amount`: Amount (positive/negative)
- Validates that both fields are filled
- Shows error toast if validation fails
- Calls `addTransaction()` prop with expense data
- Resets form after submission

**UI Elements:**
- "Expense Tracker" heading
- Expense detail input field
- Amount input field (number type)
- Submit button

#### ExpenseTable.js
**Purpose**: Displays list of all expenses in a formatted list

**Props:**
- `expenses`: Array of expense objects
- `deleteExpens`: Function to delete expense

**Functionality:**
- Maps through expenses array
- For each expense, displays:
  - Delete button (X)
  - Expense description (text)
  - Expense amount with color coding:
    - Green for income (positive amounts)
    - Red for expenses (negative amounts)
  - Currency symbol: ₹ (Rupees)

**UI Elements:**
- `.expense-list` container
- `.expense-item` for each expense
- `.delete-button` for deletion
- `.expense-description` for text
- `.expense-amount` with conditional styling

#### ExpenseDetails.js
**Purpose**: Summary component showing balance and income/expense breakdown

**Props:**
- `incomeAmt`: Total income amount
- `expenseAmt`: Total expense amount

**Functionality:**
- Calculates running balance: `incomeAmt - expenseAmt`
- Displays:
  - Current balance in large format
  - Total income with green styling
  - Total expense with red styling
  - Currency symbol: ₹ (Rupees)

**UI Elements:**
- `.amounts-container` for summary display
- `.income-amount` for income display
- `.expense-amount` for expense display

### 2. **Utility Components**

#### App.js
**Purpose**: Main application component with routing

**State:**
- `isAuthenticated`: Boolean - tracks user authentication status

**Key Logic:**
- `PrivateRoute` component: Protected route wrapper
  - Returns route element if authenticated
  - Redirects to `/login` if not authenticated

**Routes:**
- `/`: Redirects to `/login`
- `/login`: Login page (public)
- `/signup`: Signup page (public)
- `/home`: Home dashboard (protected)

**Lifecycle:**
- Renders `RefrshHandler` component to maintain session

#### RefrshHandler.js
**Purpose**: Session persistence handler

**Functionality:**
- Checks if JWT token exists in localStorage on app load
- If token exists:
  - Sets `isAuthenticated` to true
  - If user on login/signup page: Redirects to `/home`
- Ensures user remains logged in on page refresh

#### utils.js
**Purpose**: Utility functions for notifications and API configuration

**Functions:**

1. **handleSuccess(msg)**
   - Displays success toast notification
   - Position: Top-right
   - Uses react-toastify

2. **handleError(msg)**
   - Displays error toast notification
   - Position: Top-right
   - Uses react-toastify

3. **APIUrl (Export)**
   - Constant: Base API URL
   - Value: `process.env.REACT_APP_API_URL` or `'http://localhost:8080'`
   - Used in all API calls

### 3. **Styling**

#### App.css
Contains global styles for:
- `.container`: Form container styling
- `.user-section`: User greeting and logout button styling
- `.amounts-container`: Summary display styling
- `.income-amount`, `.expense-amount`: Color-coded amounts
- `.expense-list`, `.expense-item`: Expense table styling
- `.delete-button`: Delete button styling
- `.expense-description`: Description text styling
- Input, button, form element styling

---

## API Endpoints

### Base URL
`http://localhost:8080` (or configured via environment variable)

### Authentication Endpoints

#### 1. POST /auth/signup
**Register a new user**

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "message": "Signup successfully",
  "success": true
}
```

**Error Responses:**
- 409 Conflict: User already exists
```json
{
  "message": "User is already exist, you can login",
  "success": false
}
```
- 400 Bad Request: Validation error
```json
{
  "message": "Bad request",
  "error": { "details": [...] }
}
```
- 500 Internal Server Error:
```json
{
  "message": "Internal server errror",
  "success": false
}
```

#### 2. POST /auth/login
**Authenticate user and get JWT token**

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Login Success",
  "success": true,
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "john@example.com",
  "name": "John Doe"
}
```

**Error Responses:**
- 403 Forbidden: Invalid credentials
```json
{
  "message": "Auth failed email or password is wrong",
  "success": false
}
```
- 400 Bad Request: Validation error
```json
{
  "message": "Bad request",
  "error": { "details": [...] }
}
```
- 500 Internal Server Error:
```json
{
  "message": "Internal server errror",
  "success": false
}
```

### Expense Endpoints (Protected - Requires JWT)

**Authentication Header Required:**
```
Authorization: <JWT_TOKEN>
```

#### 3. GET /expenses
**Retrieve all expenses for the logged-in user**

**Request Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "message": "Fetched Expenses successfully",
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "text": "Salary",
      "amount": 50000,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "ObjectId",
      "text": "Groceries",
      "amount": -500,
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

**Error Responses:**
- 403 Forbidden: Missing or invalid JWT token
- 500 Internal Server Error

#### 4. POST /expenses
**Add a new expense or income entry**

**Request Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "Groceries",
  "amount": -500
}
```

**Success Response (200):**
```json
{
  "message": "Expense added successfully",
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "text": "Salary",
      "amount": 50000,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "_id": "ObjectId",
      "text": "Groceries",
      "amount": -500,
      "createdAt": "2024-01-15T11:00:00Z"
    }
  ]
}
```

**Error Responses:**
- 403 Forbidden: Missing or invalid JWT token
- 500 Internal Server Error

#### 5. DELETE /expenses/:expenseId
**Delete an expense entry**

**Request Parameters:**
- `expenseId`: MongoDB ObjectId of the expense to delete

**Request Headers:**
```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "message": "Expense Deleted successfully",
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "text": "Salary",
      "amount": 50000,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error Responses:**
- 403 Forbidden: Missing or invalid JWT token
- 500 Internal Server Error

### Utility Endpoints

#### GET /ping
**Health check endpoint**

**Response (200):**
```
PONG
```

---

## Database Schema

### MongoDB Collections

#### users Collection

**Document Structure:**
```javascript
{
  _id: ObjectId,
  name: String,              // User's full name (required)
  email: String,             // User's email (required, unique)
  password: String,          // Bcrypt hashed password (required)
  expenses: [
    {
      _id: ObjectId,         // Unique expense ID
      text: String,          // Expense description (required)
      amount: Number,        // Expense amount (required)
      createdAt: Date        // Timestamp (default: current date)
    }
  ]
}
```

**Indexes:**
- `email`: Unique index to prevent duplicate accounts

**Sample Document:**
```json
{
  "_id": ObjectId("60d5ec49f1b2c72b8c8e4a1b"),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2b$10$n9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWDeblsqKAU6TCUe",
  "expenses": [
    {
      "_id": ObjectId("60d5ec49f1b2c72b8c8e4a2c"),
      "text": "Monthly Salary",
      "amount": 50000,
      "createdAt": ISODate("2024-01-15T10:30:00Z")
    },
    {
      "_id": ObjectId("60d5ec49f1b2c72b8c8e4a3d"),
      "text": "Grocery Shopping",
      "amount": -1200,
      "createdAt": ISODate("2024-01-15T14:45:00Z")
    },
    {
      "_id": ObjectId("60d5ec49f1b2c72b8c8e4a4e"),
      "text": "Electricity Bill",
      "amount": -800,
      "createdAt": ISODate("2024-01-16T09:15:00Z")
    }
  ]
}
```

---

## Features & Functionality

### 1. **User Registration (Signup)**
- **Description**: New users can create an account
- **Inputs**: Name, Email, Password
- **Validation**:
  - Name: 3-100 characters
  - Email: Valid email format
  - Password: 4-100 characters
  - Duplicate email prevention
- **Security**: Passwords are hashed using bcrypt (10 salt rounds)
- **Output**: Success message, redirect to login
- **Error Handling**: Duplicate user, validation errors, server errors

### 2. **User Authentication (Login)**
- **Description**: Users can log in with their credentials
- **Inputs**: Email, Password
- **Validation**:
  - Email format validation
  - Password length validation
- **Process**:
  1. Verify email exists in database
  2. Compare password with stored hash
  3. Generate JWT token (24-hour expiration)
  4. Store token and user info in localStorage
- **Output**: JWT token, user name, email
- **Error Handling**: Invalid credentials, server errors

### 3. **Session Persistence**
- **Description**: User remains logged in on page refresh
- **Process**:
  - Check for JWT token in localStorage on app load
  - If token exists, set authenticated state
  - Auto-redirect to home if already logged in
- **Logout**: Removes token and user info from localStorage

### 4. **Add Expense/Income**
- **Description**: Users can record income (positive) or expense (negative) transactions
- **Inputs**:
  - Description (text)
  - Amount (positive for income, negative for expense)
- **Validation**: Both fields required
- **Process**:
  1. Validate input
  2. Send to backend with JWT token
  3. Add to user's expenses array in database
  4. Return updated expenses list
- **Output**: Updated expense list, success notification
- **Real-time Update**: UI updates immediately with new entry

### 5. **View All Expenses**
- **Description**: Display all income and expense entries
- **Process**:
  1. Fetch from `/expenses` endpoint on component mount
  2. Display each entry with:
     - Description
     - Amount (color-coded: green for income, red for expense)
     - Delete button
- **Real-time Updates**: Refreshes after add/delete operations
- **Session-based**: Each user sees only their expenses

### 6. **Delete Expense**
- **Description**: Remove an expense entry
- **Process**:
  1. Click delete button on expense item
  2. Send DELETE request with expense ID
  3. Remove from database using MongoDB $pull operator
  4. Return updated expenses list
- **Output**: Updated expense list, success notification
- **Confirmation**: Immediate removal from UI

### 7. **Balance Summary**
- **Description**: Real-time financial overview
- **Displays**:
  - Current balance: Income - Expense
  - Total income: Sum of all positive amounts
  - Total expense: Sum of all negative amounts (absolute value)
- **Color Coding**:
  - Income: Green
  - Expense: Red
- **Currency**: Indian Rupees (₹)
- **Real-time Updates**: Recalculates whenever expenses change

### 8. **User Dashboard**
- **Components**:
  - Welcome message with logged-in user's name
  - Logout button
  - Balance overview
  - Add expense form
  - Expenses list
- **Functionality**:
  - All components work together seamlessly
  - Single page for all expense management
  - Responsive layout

### 9. **Notifications**
- **Toast Notifications** (using react-toastify):
  - Success messages for completed actions
  - Error messages for failed operations
  - Position: Top-right corner
  - Auto-dismiss after timeout

### 10. **Error Handling**
- **Frontend Validation**:
  - Form field validation before API calls
  - User-friendly error messages
- **Backend Validation**:
  - Input schema validation using Joi
  - Duplicate email checking
  - Password verification
- **Authentication Errors**:
  - 403 Forbidden: Auto-logout and redirect to login
  - Invalid JWT: Clear token and require re-authentication
- **Server Errors**:
  - 400 Bad Request: Validation errors
  - 409 Conflict: Duplicate resources
  - 500 Internal Server Error: Server-side issues

---

## User Authentication Flow

### Registration Flow
```
1. User navigates to signup page
          ↓
2. User fills form (name, email, password)
          ↓
3. Frontend validates input
          ↓
4. POST /auth/signup with credentials
          ↓
5. Backend validates using Joi schema
          ↓
6. Check if email already exists
          ↓
7. Hash password using bcrypt
          ↓
8. Create user document in MongoDB
          ↓
9. Return success response (201)
          ↓
10. Show success toast and redirect to login
```

### Login Flow
```
1. User navigates to login page
          ↓
2. User fills form (email, password)
          ↓
3. Frontend validates input
          ↓
4. POST /auth/login with credentials
          ↓
5. Backend validates using Joi schema
          ↓
6. Find user by email in database
          ↓
7. Compare password with hashed password
          ↓
8. Generate JWT token (exp: 24 hours)
          ↓
9. Return token, name, and email (200)
          ↓
10. Store token and name in localStorage
          ↓
11. Show success toast and redirect to home
```

### Protected Route Access
```
1. User tries to access /home or /expenses endpoints
          ↓
2. Check for JWT token in localStorage
          ↓
3. If no token: Redirect to login
          ↓
4. If token exists: Include in Authorization header
          ↓
5. Backend middleware (ensureAuthenticated) verifies JWT
          ↓
6. If invalid/expired: Return 403, clear token, redirect to login
          ↓
7. If valid: Extract user ID and continue to route handler
          ↓
8. Process request with user context
```

---

## Expense Management Flow

### Add Expense Flow
```
1. User fills ExpenseForm (description, amount)
          ↓
2. Frontend validates (both fields required)
          ↓
3. POST /expenses with JWT token
          ↓
4. Backend Auth middleware verifies JWT
          ↓
5. Extract user ID from JWT payload
          ↓
6. Use MongoDB $push to add to expenses array
          ↓
7. Return updated expenses list (200)
          ↓
8. Frontend updates state
          ↓
9. UI re-renders with new expense
          ↓
10. Show success toast
          ↓
11. Balance calculations automatically update
```

### Retrieve Expenses Flow
```
1. Component mounts / User navigates to home
          ↓
2. GET /expenses with JWT token
          ↓
3. Backend Auth middleware verifies JWT
          ↓
4. Find user by ID and select only expenses
          ↓
5. Return expenses array (200)
          ↓
6. Frontend updates expenses state
          ↓
7. UI renders ExpenseTable with all entries
          ↓
8. Background calculations for income/expense totals
```

### Delete Expense Flow
```
1. User clicks delete button on expense
          ↓
2. DELETE /expenses/:expenseId with JWT token
          ↓
3. Backend Auth middleware verifies JWT
          ↓
4. Extract user ID and expense ID
          ↓
5. Use MongoDB $pull to remove from expenses array
          ↓
6. Return updated expenses list (200)
          ↓
7. Frontend updates state
          ↓
8. UI removes deleted item
          ↓
9. Show success toast
          ↓
10. Balance calculations automatically update
```

---

## Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database (local or cloud - Atlas)
- npm or yarn package manager
- Git (optional)

### Backend Setup

#### Step 1: Navigate to backend directory
```bash
cd backend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create .env file
```bash
# Create file: backend/.env
MONGO_CONN=mongodb://localhost:27017/expense-tracker
# OR for MongoDB Atlas:
# MONGO_CONN=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker

JWT_SECRET=your_jwt_secret_key_here
PORT=8080
```

#### Step 4: Start backend server
```bash
# Development mode (with nodemon)
npm run dev

# OR Production mode
npm start
```

**Expected Output:**
```
Server is running on 8080
MongoDB Connected...
```

### Frontend Setup

#### Step 1: Navigate to frontend directory
```bash
cd frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Create .env file
```bash
# Create file: frontend/.env
REACT_APP_API_URL=http://localhost:8080
```

#### Step 4: Start React development server
```bash
npm start
```

**Expected Output:**
```
Compiled successfully!
On Your Network: http://192.168.x.x:3000
Local:          http://localhost:3000
```

### Access Application
- Frontend: Open browser and navigate to `http://localhost:3000`
- Backend API: Available at `http://localhost:8080`
- Initial page: Login/Signup

---

## Environment Configuration

### Backend Environment Variables

#### Mandatory Variables
```bash
MONGO_CONN=<MongoDB connection string>
JWT_SECRET=<Secret key for JWT signing>
```

#### Optional Variables
```bash
PORT=8080  # Default port if not specified
```

### Frontend Environment Variables

#### Mandatory Variables
```bash
REACT_APP_API_URL=<Backend API base URL>
```

#### Default Values
```bash
# If not specified, defaults to:
REACT_APP_API_URL=http://localhost:8080
```

### MongoDB Connection String Examples

#### Local MongoDB
```
mongodb://localhost:27017/expense-tracker
```

#### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
```

#### Environment-Specific Configuration

**Development:**
```bash
# backend/.env
MONGO_CONN=mongodb://localhost:27017/expense-tracker-dev
JWT_SECRET=dev-secret-key-12345
PORT=8080

# frontend/.env
REACT_APP_API_URL=http://localhost:8080
```

**Production:**
```bash
# backend/.env
MONGO_CONN=mongodb+srv://user:password@cluster.mongodb.net/expense-tracker-prod
JWT_SECRET=prod-secret-key-secure-random-string
PORT=8080

# frontend/.env
REACT_APP_API_URL=https://api.yourdomain.com
```

---

## Security Features

### 1. **Password Hashing**
- Bcrypt with 10 salt rounds
- Prevents plaintext password storage
- Secure password comparison

### 2. **JWT Authentication**
- Token-based authentication
- 24-hour token expiration
- Signed with secret key
- Included in Authorization header

### 3. **Input Validation**
- Client-side validation (React)
- Server-side validation using Joi schema
- Double validation prevents malicious input

### 4. **Protected Routes**
- Auth middleware on all expense endpoints
- 403 Forbidden response for invalid/missing tokens
- Automatic logout on token expiration

### 5. **CORS Protection**
- CORS middleware enabled
- Restricts cross-origin requests

### 6. **Database Security**
- Unique email constraint prevents duplicate accounts
- User data embedding ensures data isolation
- MongoDB connection string in environment variables

---

## Future Enhancement Ideas

1. **Expense Categories**: Add category tags for expenses
2. **Budget Limits**: Set monthly/category budgets with alerts
3. **Reports & Analytics**: Charts showing spending patterns
4. **Export Reports**: PDF/CSV export functionality
5. **Recurring Expenses**: Automated recurring transactions
6. **Multi-currency Support**: Support for different currencies
7. **Mobile App**: React Native version for mobile
8. **Email Notifications**: Monthly summary emails
9. **Expense Sharing**: Share expenses with family members
10. **Advanced Filters**: Filter by date, category, amount range
11. **Two-Factor Authentication**: Enhanced security
12. **Expense OCR**: Receipt scanning and data extraction

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
**Problem**: "MongoDB Connection Error"
**Solutions**:
- Verify MongoDB is running locally or cloud connection active
- Check MONGO_CONN environment variable is correct
- Verify database credentials if using Atlas

#### 2. JWT Token Invalid
**Problem**: "Unauthorized, JWT token wrong or expired"
**Solutions**:
- Verify JWT_SECRET is same in backend and is correct
- Check token hasn't expired (24-hour limit)
- Clear localStorage and login again

#### 3. API Not Responding
**Problem**: "Cannot reach backend API"
**Solutions**:
- Verify backend server is running on correct port
- Check REACT_APP_API_URL in frontend .env
- Verify firewall/network isn't blocking the port

#### 4. CORS Errors
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"
**Solutions**:
- Ensure CORS middleware is enabled in Express
- Verify frontend URL is allowed in CORS configuration
- Check browser console for specific error

#### 5. Pages Not Loading
**Problem**: Blank page or routing issues
**Solutions**:
- Clear browser cache and localStorage
- Verify React Router configuration in App.js
- Check browser console for JavaScript errors

---

## Performance Optimization

### Current Implementation
- **Frontend**: Minimal re-renders using React hooks
- **Backend**: Efficient MongoDB queries with selected fields
- **Database**: Embedded expenses array for quick access
- **Authentication**: JWT reduces database queries

### Potential Improvements
- Client-side caching of expenses
- Pagination for large expense lists
- Backend query optimization with indexes
- Minification and code splitting for frontend
- CDN for static assets
- Database connection pooling

---

## Testing Recommendations

### Manual Testing Checklist
- [ ] Signup with new email
- [ ] Signup with existing email (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Add expense with positive amount (income)
- [ ] Add expense with negative amount (expense)
- [ ] Add expense without filling all fields (should fail)
- [ ] View expense list immediately after adding
- [ ] Delete an expense
- [ ] Verify balance calculation is correct
- [ ] Logout and verify redirect to login
- [ ] Refresh page and verify session persists
- [ ] Try accessing /home without login (should redirect)

### Automated Testing
- Unit tests for controllers
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for user flows

---

## Deployment

### Deploy Backend
The project includes `backend/vercel.json` for Vercel deployment:
```bash
# Build and deploy to Vercel
vercel deploy
```

### Deploy Frontend
The project includes `frontend/vercel.json` for Vercel deployment:
```bash
# Build and deploy to Vercel
vercel deploy
```

### Deployment Checklist
- [ ] Set environment variables on hosting platform
- [ ] Configure MongoDB for production
- [ ] Use secure JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Run production build
- [ ] Test all endpoints
- [ ] Monitor logs and errors

---

## Conclusion

The MERN Expense Tracker is a full-featured personal finance management application demonstrating:
- Modern web development best practices
- Secure authentication and authorization
- RESTful API design
- State management in React
- MongoDB as a NoSQL database
- User-friendly interface

The architecture is scalable and can be extended with additional features as requirements grow.

