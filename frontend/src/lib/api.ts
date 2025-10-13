import axios, { InternalAxiosRequestConfig } from 'axios';

// Default to relative /api for Vercel monorepo deployments
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types (moved from supabase.ts)
export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string;
  created_at: string;
  email?: string;
};

export type Post = {
  id: string;
  user_id: string;
  image_url: string;
  caption: string;
  created_at: string;
  profiles: Profile;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
};

export type Comment = {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  profiles: Profile;
};

export type Like = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
};

export type Bookmark = {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
};

export type Follower = {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
};

// Auth functions
export const authAPI = {
  register: async (userData: { username: string; full_name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const response = await api.get('/auth/me'); // We'll add this route later if needed
    return response.data;
  },
};

// Posts functions
export const postsAPI = {
  getPosts: async (limit = 10, offset = 0, userId?: string) => {
    const params = new URLSearchParams({ limit: limit.toString(), offset: offset.toString() });
    if (userId) params.append('userId', userId);
    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
  },

  createPost: async (formData: FormData) => {
    const response = await api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getPost: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  updatePost: async (id: string, data: { caption: string }) => {
    const response = await api.put(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

// Likes functions
export const likesAPI = {
  likePost: async (postId: string) => {
    const response = await api.post(`/likes/${postId}`);
    return response.data;
  },

  unlikePost: async (postId: string) => {
    const response = await api.delete(`/likes/${postId}`);
    return response.data;
  },

  getLikes: async (postId: string) => {
    const response = await api.get(`/likes/${postId}`);
    return response.data;
  },
};

// Comments functions
export const commentsAPI = {
  getComments: async (postId: string) => {
    const response = await api.get(`/comments/${postId}`);
    return response.data;
  },

  addComment: async (postId: string, content: string) => {
    const response = await api.post(`/comments/${postId}`, { content });
    return response.data;
  },

  updateComment: async (id: string, content: string) => {
    const response = await api.put(`/comments/${id}`, { content });
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};

// Bookmarks functions
export const bookmarksAPI = {
  bookmarkPost: async (postId: string) => {
    const response = await api.post(`/bookmarks/${postId}`);
    return response.data;
  },

  unbookmarkPost: async (postId: string) => {
    const response = await api.delete(`/bookmarks/${postId}`);
    return response.data;
  },

  getBookmarks: async () => {
    const response = await api.get('/bookmarks');
    return response.data;
  },
};

// Followers functions
export const followersAPI = {
  followUser: async (userId: string) => {
    const response = await api.post(`/followers/${userId}`);
    return response.data;
  },

  unfollowUser: async (userId: string) => {
    const response = await api.delete(`/followers/${userId}`);
    return response.data;
  },

  getFollowers: async (userId: string) => {
    const response = await api.get(`/followers/followers/${userId}`);
    return response.data;
  },

  getFollowing: async (userId: string) => {
    const response = await api.get(`/followers/following/${userId}`);
    return response.data;
  },
};
