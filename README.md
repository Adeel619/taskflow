# TaskFlow Personal Task & Productivity Manager

A full-stack web application built with **React.js** (frontend) and **Node.js + Express** (backend).
Allows users to manage tasks across project boards with priorities, deadlines, and a live dashboard.

---

## Features

-  Create, edit, delete, and complete tasks
-  Organize tasks into project boards
-  Priority levels: High / Medium / Low
-  Due dates with overdue detection
-  Live dashboard with statistics (total, completed, pending, overdue)
-  Fully responsive (desktop, tablet, mobile)

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js (Vite), CSS, Axios       |
| Backend   | Node.js, Express.js               |
| Storage   | JSON file-based (fs module)       |
| Icons     | Lucide React                      |
| Toasts    | React Hot Toast                   |

---


## Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **npm** v8 or higher

### 1. Clone the repository
```bash
git clone https://github.com/Adeel619/taskflow.git
cd taskflow
```

### 2. Start the Backend
```bash
cd backend
npm install
npm start
```
The backend API will run on **http://localhost:5000**

### 3. Start the Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
The React app will run on **http://localhost:3000**

### 4. Open in browser
Visit **http://localhost:3000**

---

## API Endpoints

### Tasks
| Method | Endpoint                    | Description              |
------------------------------------------------------------------
 GET         /api/tasks                      Get all tasks           
 GET         /api/tasks?projectId=:id        Get tasks by project     
 GET         /api/tasks/stats                Get dashboard statistics 
 POST        /api/tasks                      Create a new task        
 PUT         /api/tasks/:id                  Update a task            
 PATCH       /api/tasks/:id/toggle           Toggle task completion   
 DELETE      /api/tasks/:id                  Delete a task            

### Projects
| Method | Endpoint                | Description                        
--------------------------------------------------------------------
 GET     /api/projects            Get all projects                   
 POST    /api/projects            Create a new project               
 PUT     /api/projects/:id        Update a project                   
 DELETE  /api/projects/:id        Delete project + its tasks         

---


## Author
Muhammad Adeel Bachelor Student — IU International University  
Web Development Portfolio — Phase 2
