
import { Post, UserProfile, Space } from './types';

export const BRAND_AVATAR = 'https://img.freepik.com/premium-vector/3d-chat-bubble-icon-concept-social-media-message-communication-style_101434-586.jpg?w=800';

// This is your unique "World Key". If you change this, you move to a different network.
export const GLOBAL_NETWORK_ID = 'yaply_world_alpha_v1';
export const CLOUD_API_URL = `https://kvdb.io/B1w5Z7dE8vH9A2m4s6Y7p1/${GLOBAL_NETWORK_ID}`;

export const SPACES: Space[] = [
  { id: 'general', label: 'General', icon: 'globe', color: 'slate' },
  { id: 'tech', label: 'Tech', icon: 'cpu', color: 'blue' },
  { id: 'gaming', label: 'Gaming', icon: 'gamepad', color: 'indigo' },
  { id: 'memes', label: 'Memes', icon: 'shapes', color: 'pink' },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u1',
    username: 'yaply',
    password: 'password', 
    displayName: 'Yaply Global',
    bio: 'The heartbeat of the public network. 🎙️',
    avatarUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200',
    following: [],
    followers: [],
    createdAt: Date.now(),
    role: 'owner',
    isVerified: true
  }
];

// Fix: Added missing INITIAL_POSTS export for App.tsx
export const INITIAL_POSTS: Post[] = [];

export const MAX_CHARS = 280;
export const STORAGE_KEY_ME = 'yaply_me_id_v10';
// Fix: Added missing STORAGE_KEY_USERS export for auth.ts
export const STORAGE_KEY_USERS = 'yaply_users_v10';
export const THEME_STORAGE_KEY = 'yaply_theme_v10';
