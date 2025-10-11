# Social Media App

A full-stack social media application built with React (frontend) and Node.js/Express (backend), using MongoDB for data storage.

## Features

- User authentication (register/login)
- Create and view posts
- Like, comment, and bookmark posts
- Follow/unfollow users
- User profiles

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, MongoDB, JWT
- **Deployment:** Render (frontend and backend)

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud)
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/social-media.git
   cd social-media
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Set up environment variables:
   - Create `backend/.env` with:
     ```
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

5. Start the backend:
   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

7. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment

### Using Render (Recommended for Monorepo)

1. Push your code to GitHub.
2. In Render dashboard, connect your repo and use the `render.yaml` file for automatic service setup.
3. Set environment variables in Render:
   - Backend: MONGO_URI, JWT_SECRET, NODE_ENV=production
   - Frontend: VITE_API_URL=https://your-backend-service.onrender.com/api
4. Deploy both services. Render will handle builds and scaling.

### Manual Setup (Alternative)

#### Frontend (Render)

1. Create a new Static Site in Render dashboard.
2. Connect GitHub repo, root directory: `frontend`.
3. Build Command: `npm run build`.
4. Publish Directory: `dist`.
5. Set VITE_API_URL to your backend URL.
6. Deploy.

#### Backend (Render)

1. Create a new Web Service.
2. Connect GitHub repo, root directory: `backend`.
3. Runtime: Node.
4. Build Command: `npm install`.
5. Start Command: `npm start`.
6. Set env vars: MONGO_URI, JWT_SECRET, NODE_ENV=production.
7. Deploy.

### Alternative: Docker

If using Docker for backend:

1. Build the image:
   ```bash
   cd backend
   docker build -t social-media-backend .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 --env-file .env social-media-backend
   ```

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like post
- `POST /api/posts/:id/comment` - Comment on post
- And more...

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
