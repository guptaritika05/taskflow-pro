# TaskFlow - Project Management System

A full-stack project management application built for Ethara AI Round 1 assessment. Users can create projects, manage tasks, track progress, and collaborate with team members based on role-based access control.


## Features

### Authentication
- User registration with name, email, password, and role selection
- User login with JWT token based authentication
- Protected routes for authenticated users

### Project Management
- Create new projects with name and description
- View all projects in a responsive grid layout
- Update project details
- Delete projects with cascade deletion of associated tasks

### Task Management
- Create tasks with title, description, due date, and priority levels
- Update task status (pending, in_progress, completed)
- Delete tasks
- View all tasks across projects

### Dashboard
- Statistics cards showing total projects, total tasks, completed tasks, pending tasks
- Recent tasks list showing latest 5 tasks

### Role Based Access Control
- Admin: Full access to all projects and tasks across all users
- Member: Limited access to only their own projects and assigned tasks

### Responsive Design
- Fully responsive UI that works on desktop, tablet, and mobile devices
- Mobile-friendly navigation and layouts

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router DOM
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Project Structure
taskflow/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ │ ├── authController.js
│ │ │ ├── projectController.js
│ │ │ └── taskController.js
│ │ ├── middleware/
│ │ │ ├── authMiddleware.js
│ │ │ └── roleMiddleware.js
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ ├── Project.js
│ │ │ └── Task.js
│ │ ├── routes/
│ │ │ ├── authRoutes.js
│ │ │ ├── projectRoutes.js
│ │ │ └── taskRoutes.js
│ │ └── index.js
│ ├── .env
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Layout.jsx
│ │ │ ├── ProjectCard.jsx
│ │ │ └── LoadingSpinner.jsx
│ │ ├── pages/
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Projects.jsx
│ │ │ ├── ProjectDetail.jsx
│ │ │ └── Tasks.jsx
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── services/
│ │ │ └── api.js
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── .env
│ ├── package.json
│ └── tailwind.config.js
└── README.md

text

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user info |

### Project Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects | Get all projects |
| POST | /api/projects | Create new project |
| PUT | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

### Task Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/project/:projectId/tasks | Get tasks by project |
| POST | /api/tasks/project/:projectId/tasks | Create task |
| PUT | /api/tasks/tasks/:id | Update task |
| DELETE | /api/tasks/tasks/:id | Delete task |

## Installation and Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend folder
```bash
cd backend
npm install
npm start