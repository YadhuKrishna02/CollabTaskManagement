# Collaborative Task Management App

A powerful and user-friendly application designed to help teams create, assign, track, and manage tasks effectively. Built using modern web technologies with a focus on scalability, responsiveness, and performance.

---

## Features

### Frontend (React, TailwindCSS/Shadcn)
#### Authentication
- **Login & Registration** with JWT-based authentication.
- **Password validation** with strength indicators for a secure experience.

#### Dashboard
- **Kanban-style task layout** categorized as "To Do", "In Progress", and "Completed."
- **Drag-and-drop functionality** to move tasks between categories.

#### Task Management
- **Modal forms** for creating and editing tasks.
- Task fields include:
  - title
  - description
  - priority (High, Medium, Low)
  - assigned_users
  - due_date
- Fully responsive UI using **TailwindCSS**

#### User Management
- **Admin Users:**
  - Add new team members.
  - Assign tasks to users.
  - View task progress for each user.
- **Non-Admin Users:**
  - View only their assigned tasks.
  - Update task status.

#### Notifications
- **Notification banner/dropdown** for updates on task assignments or status changes.

---

### Backend (Node.js, Express, MongoDB)
#### Authentication
- **JWT-based authentication** with role-based access control (Admin, User).
- Passwords are hashed securely using **bcrypt**.
### BASE URL - `http://localhost:4000/api`
#### Auth API
- **Endpoints:**
  - `POST auth/log-in` – Login a user
  - `POST auth/sign-up` – Register a new user

#### Task Management API
- **Endpoints:**
  - `POST /tasks` – Create a new task.
  - `GET /tasks` – Retrieve all tasks (with filters for user or status).
  - `PUT /tasks/:id` – Update task details.
  - `DELETE /tasks/:id` – Delete a task.

#### User Management API
- **Endpoints:**
  - `POST /users` – Register a new user.
  - `GET /users` – Retrieve all users (Admin only).
  - `GET /users/:id` – Get user details.
  - `PUT /users/:id` – Update user details.
  - `DELETE /users/:id` – Delete a user.

#### Database Design
- **Users Table/Collection:**
  - Fields: `id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`.
- **Tasks Table/Collection:**
  - Fields: `id`, `title`, `description`, `priority`, `status`, `assignedUsers`, `dueDate`, `createdAt`, `updatedAt`.
- **Notifications Table/Collection:**
  - Tracks updates for task assignments and status changes.

---



### Real-Time Updates
- Integrated **Socket.IO** for real-time task status updates across all team members.

### Analytics Dashboard
- View statistics such as:
  - Tasks per category.


---

## Tech Stack
### Frontend
- React
- TailwindCSS
- React Query for efficient data fetching

### Backend
- Node.js
- Express
- MongoDB
- JWT for authentication
- Socket.IO for real-time updates

---

## Deployment
- **Backend:** Deployed on AWS
- **Database:** Hosted on MongoDB Atlas

---

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm
- MongoDB  

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/YadhuKrishna02/CollabTaskManagement.git

2. cd client && npm install
   cd server && npm install

3. Start the development servers:
        cd client
            - npm run dev
        cd server
            - npm run dev

- Backend hosted on AWS in ip 13.61.15.231
- Frontend hosting facing some issues
