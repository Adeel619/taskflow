# TaskFlow — Test Cases

Manual test cases covering all major features of the application.

---

## TC-01: Create a Task

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-01                                         |
| Feature     | Task Creation                                 |
| Precondition| Application is running, user is on Dashboard  |
| Steps       | 1. Click "Add Task" button                    |
|             | 2. Enter title: "Buy groceries"               |
|             | 3. Set priority: High                         |
|             | 4. Set due date: tomorrow's date              |
|             | 5. Click "Create Task"                        |
| Expected    | Task appears in task list with correct title, priority badge, and due date |
| Status      | PASS                                          |

---

## TC-02: Create Task Without Title (Validation)

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-02                                         |
| Feature     | Input Validation                              |
| Steps       | 1. Click "Add Task"                           |
|             | 2. Leave title empty                          |
|             | 3. Click "Create Task"                        |
| Expected    | Error message "Task title is required" shown; task NOT created |
| Status      | PASS                                          |

---

## TC-03: Toggle Task Completion

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-03                                         |
| Feature     | Task Completion Toggle                        |
| Steps       | 1. Find any incomplete task                   |
|             | 2. Click the circular checkbox button         |
| Expected    | Task turns grey with strikethrough text; dashboard "Completed" counter increases by 1 |
| Status      | PASS                                          |

---

## TC-04: Edit a Task

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-04                                         |
| Feature     | Task Editing                                  |
| Steps       | 1. Click the pencil icon on any task          |
|             | 2. Change the title to "Updated title"        |
|             | 3. Change priority to Low                     |
|             | 4. Click "Save Changes"                       |
| Expected    | Task displays updated title and new priority badge |
| Status      | PASS                                          |

---

## TC-05: Delete a Task

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-05                                         |
| Feature     | Task Deletion                                 |
| Steps       | 1. Click the trash icon on any task           |
|             | 2. Confirm deletion in the dialog             |
| Expected    | Task removed from list; dashboard total decreases by 1 |
| Status      | PASS                                          |

---

## TC-06: Overdue Task Detection

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-06                                         |
| Feature     | Overdue Detection                             |
| Steps       | 1. Create a task with a past due date         |
|             | 2. Leave it incomplete                        |
| Expected    | Due date shown in red with "Overdue" label; dashboard overdue counter increases |
| Status      | PASS                                          |

---

## TC-07: Filter Tasks by Status

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-07                                         |
| Feature     | Task Filtering                                |
| Steps       | 1. Navigate to "All Tasks" page               |
|             | 2. Click "Completed" filter button            |
| Expected    | Only completed tasks are shown in the list    |
| Status      | PASS                                          |

---

## TC-08: Filter Tasks by Priority

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-08                                         |
| Feature     | Priority Filtering                            |
| Steps       | 1. Navigate to "All Tasks"                    |
|             | 2. Click "High" priority filter               |
| Expected    | Only high-priority tasks shown                |
| Status      | PASS                                          |

---

## TC-09: Create a Project

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-09                                         |
| Feature     | Project Creation                              |
| Steps       | 1. Navigate to "Projects"                     |
|             | 2. Click "New Project"                        |
|             | 3. Enter name: "Test Project"                 |
|             | 4. Select a color                             |
|             | 5. Click "Create Project"                     |
| Expected    | New project card appears in grid; project appears in sidebar navigation |
| Status      | PASS                                          |

---

## TC-10: Delete Project Cascades to Tasks

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-10                                         |
| Feature     | Cascade Delete                                |
| Steps       | 1. Create a project and add 2 tasks to it     |
|             | 2. Go to Projects page                        |
|             | 3. Delete the project                         |
| Expected    | Project removed; its tasks no longer appear in "All Tasks" |
| Status      | PASS                                          |

---

## TC-11: Responsive Layout — Mobile

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-11                                         |
| Feature     | Responsive Design                             |
| Steps       | 1. Open app in browser                        |
|             | 2. Resize window to < 640px width             |
|             | 3. Verify sidebar is hidden                   |
|             | 4. Click hamburger menu icon                  |
| Expected    | Sidebar slides in from the left; all content is readable and usable |
| Status      | PASS                                          |

---

## TC-12: Backend API — Health Check

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-12                                         |
| Feature     | API Availability                              |
| Steps       | 1. Open browser or Postman                    |
|             | 2. GET http://localhost:5000/api/health       |
| Expected    | Returns: `{ "status": "OK", "message": "TaskFlow API is running" }` |
| Status      | PASS                                          |

---

## TC-13: Invalid API Request

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-13                                         |
| Feature     | API Error Handling                            |
| Steps       | 1. POST /api/tasks with empty body            |
| Expected    | Returns HTTP 400 with error: "Task title is required" |
| Status      | PASS                                          |

---

## TC-14: Dashboard Stats Accuracy

| Field       | Value                                         |
|-------------|-----------------------------------------------|
| Test ID     | TC-14                                         |
| Feature     | Dashboard Statistics                          |
| Steps       | 1. Note current stats on dashboard            |
|             | 2. Complete one task                          |
|             | 3. Refresh dashboard                          |
| Expected    | "Completed" count increases by 1; "Pending" decreases by 1 |
| Status      | PASS                                          |
