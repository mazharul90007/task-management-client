# Task Management Application

## Live Link
## [Taskify](https://task-management-48e66.web.app/)

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

## Dependencies
### Project Dependencies:
- `@tailwindcss/vite` ^4.0.7
- `@tanstack/react-query` ^5.66.8
- `axios` ^1.7.9
- `firebase` ^11.3.1
- `localforage` ^1.10.0
- `match-sorter` ^8.0.0
- `prop-types` ^15.8.1
- `react` ^18.2.0
- `react-beautiful-dnd` ^13.1.1
- `react-dom` ^18.2.0
- `react-firebase-hooks` ^5.1.1
- `react-hook-form` ^7.54.2
- `react-icons` ^5.5.0
- `react-router-dom` ^7.2.0
- `react-toastify` ^11.0.3
- `sort-by` ^1.2.0
- `sweetalert2` ^11.17.2
- `tailwindcss` ^4.0.7

### Development Dependencies:
- `@eslint/js` ^9.19.0
- `@types/react` ^19.0.8
- `@types/react-dom` ^19.0.3
- `@vitejs/plugin-react` ^4.3.4
- `daisyui` ^5.0.0-beta.8
- `eslint` ^9.19.0
- `eslint-plugin-react` ^7.37.4
- `eslint-plugin-react-hooks` ^5.0.0
- `eslint-plugin-react-refresh` ^0.4.18
- `globals` ^15.14.0
- `vite` ^6.1.0

## Installation Steps
1. **Clone the repository**:
   ```sh
   git clone https://github.com/mazharul90007/task-management-client.git
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
   git clone https://github.com/mazharul90007/task-management-server.git
   cd task-management-server
   ```
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
Developed by **Mazharul Islam Sourabh**.

---

Feel free to modify the README based on your actual repository links and configuration.
