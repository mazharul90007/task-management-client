# Task Management Application

## Live Link
[Click here to view the live application](#)

## Description
This Task Management Application allows users to manage their tasks efficiently by adding, editing, deleting, and reordering them using a drag-and-drop interface. The tasks are categorized into three sections: **To-Do, In Progress, and Done**. Changes are instantly saved to the database for persistence. Only authenticated users can access the application via **Firebase Authentication**.

## Features
- **Authentication**: Google Sign-in using Firebase Authentication.
- **Task Management**:
  - Add, edit, and delete tasks.
  - Drag-and-drop tasks between categories.
  - Reorder tasks within categories.
  - Instant updates in the database.
- **Real-time Synchronization**:
  - Uses **MongoDB Change Streams** for real-time updates.
  - **Optimistic UI Updates** for a smooth user experience.
- **Frontend**:
  - Built with **Vite + React**.
  - Uses **react-beautiful-dnd** for drag-and-drop.
  - Fully responsive UI (desktop & mobile).
- **Backend**:
  - Express.js API with MongoDB.
  - CRUD operations with endpoints:
    - `POST /tasks` – Add a new task
    - `GET /tasks` – Retrieve all tasks for the logged-in user
    - `PUT /tasks/:id` – Update task details
    - `DELETE /tasks/:id` – Delete a task
- **Bonus Features**:
  - Dark mode toggle.
  - Activity log for tracking changes.

## Technologies Used
### Frontend:
- **React 18** (with Vite.js)
- **Tailwind CSS + DaisyUI** (for UI styling)
- **React Beautiful DnD** (for drag-and-drop)
- **Firebase Authentication** (Google Sign-In)
- **React Query** (for data fetching & caching)
- **React Hook Form** (for form handling)
- **React Router DOM** (for routing)
- **Axios** (for API calls)
- **React Toastify & SweetAlert2** (for notifications)

### Backend:
- **Node.js + Express.js** (for API)
- **MongoDB + Mongoose** (for database management)
- **WebSockets** (for real-time updates)

## Installation Steps
1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/task-management.git
   cd task-management
   ```
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Set up Firebase Authentication**:
   - Create a Firebase project.
   - Enable Google Authentication.
   - Copy Firebase config and place it in `.env` file.
4. **Set up the Backend**:
   - Configure MongoDB connection.
   - Run the backend server:
     ```sh
     npm run server
     ```
5. **Start the Frontend**:
   ```sh
   npm run dev
   ```

## Folder Structure
```
project-root/
│── backend/   # Express.js backend
│── frontend/  # React frontend
│── README.md
│── package.json
│── .gitignore
```

## Future Improvements
- Implement task due dates with color indicators (e.g., overdue tasks turn red).
- Improve accessibility for drag-and-drop actions.
- Add user settings for customizing the UI.

## Author
Developed by **Your Name**.

---

Feel free to modify the README based on your actual repository links and configuration.
