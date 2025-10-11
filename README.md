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
- **Deployment:** Vercel (frontend), Railway/Docker (backend)

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

### Frontend (Vercel)

1. Push your code to GitHub.
2. Connect your GitHub repo to Vercel.
3. Vercel will automatically detect the Vite project and deploy it.
4. Update the API base URL in `frontend/src/lib/api.ts` to point to your deployed backend.

### Backend (Railway)

1. Create a Railway account and project.
2. Connect your GitHub repo.
3. Set environment variables in Railway dashboard:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy.

### Backend (Docker)

If using Docker:

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
