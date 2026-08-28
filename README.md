# Task Management System

A full-stack web application for managing personal tasks, built with **React** and **Spring Boot**. The application provides secure JWT-based authentication, task management, search and filtering, and a dashboard with task analytics.

## 🚀 Features

### 🔐 Authentication & Security

* User registration and login
* JWT-based authentication and authorization
* Secure password handling
* Protected task APIs
* Environment variables for sensitive configuration
* CORS configuration for frontend-backend communication

### 📝 Task Management

* Create tasks
* View personal tasks
* Update tasks
* Delete tasks
* Manage task status
* Manage task priority

### 🔎 Search & Filtering

* Search tasks by title
* Filter tasks by status
* Filter tasks by priority

### 📊 Dashboard Analytics

The dashboard provides basic task insights:

* Total Tasks
* TODO Tasks
* In Progress Tasks
* Completed Tasks
* High Priority Tasks

### 🎨 User Interface

* Clean and simple dashboard
* Task list view
* Create and update task form
* Loading states
* Error handling
* Responsive user interface

## 🛠️ Technology Stack

### Frontend

* React
* JavaScript
* Vite
* HTML5
* CSS3

### Backend

* Java
* Spring Boot
* Spring Security
* JWT
* REST APIs
* Maven

### Database

* MySQL

### Development Tools

* Visual Studio Code
* MySQL Workbench
* Postman
* Git
* GitHub

## 🏗️ Project Structure

```text
task-management-system/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/taskmanagement/
│   │       └── resources/
│   ├── pom.xml
│   └── api-test.http
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔄 Application Flow

```text
User
 │
 ▼
React Frontend
 │
 │ HTTP / REST API
 ▼
Spring Boot Backend
 │
 ├── JWT Authentication
 ├── Task Management
 └── Business Logic
 │
 ▼
MySQL Database
```

## 🔐 Configuration & Security

Sensitive configuration is kept outside the source code using environment variables.

The backend uses:

```text
DB_PASSWORD
JWT_SECRET
```

The local `application.properties` file references these variables instead of storing the actual credentials:

```properties
spring.datasource.password=${DB_PASSWORD}
jwt.secret=${JWT_SECRET}
```

> Never commit actual database passwords, JWT secrets, or other sensitive credentials to GitHub.

## ▶️ Running the Project Locally

### Prerequisites

* Java
* Maven
* Node.js and npm
* MySQL
* Git

### 1. Clone the repository

```bash
git clone https://github.com/sanjaymadduri54/task-management-system.git
cd task-management-system
```

### 2. Configure the database

Create the required MySQL database and configure the following environment variables on your system:

```text
DB_PASSWORD
JWT_SECRET
```

### 3. Start the backend

From the project root:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The Spring Boot backend runs on:

```text
http://localhost:8080
```

### 4. Start the frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your browser.

## 🔗 Main API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```text
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
```

Task endpoints require authenticated requests using JWT bearer authentication.

## 🧪 Testing

The application was tested by verifying:

* User registration
* User login
* JWT-protected task access
* Task creation
* Task retrieval
* Task updates
* Task deletion
* Status filtering
* Priority filtering
* Title search
* Dashboard analytics
* Loading state
* Backend error handling

API requests can also be tested using the included:

```text
backend/api-test.http
```

## 📸 Screenshots

Screenshots of the application dashboard, task management interface, search/filter functionality, and analytics dashboard can be added here.

## 📌 Future Improvements

Possible future enhancements include:

* Task due dates and reminders
* Advanced analytics and charts
* Pagination for larger task lists
* User profile management
* Role-based access control
* Cloud deployment
* Automated unit and integration testing

## 👨‍💻 Project Summary

**Task Management System**

A full-stack project demonstrating practical experience with:

**React · Java · Spring Boot · Spring Security · JWT · REST APIs · MySQL · Git/GitHub**

**GitHub Repository:**
https://github.com/sanjaymadduri54/task-management-system

## Screenshots

### Dashboard

![Task Management Dashboard](screenshots/dashboard.png)

### Tasks, Search and Filters

![Tasks and Filters](screenshots/tasks-and-filters.png)
