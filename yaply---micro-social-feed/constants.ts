
import { Post, UserProfile, Space } from './types';

export const BRAND_AVATAR = 'https://img.freepik.com/premium-vector/3d-chat-bubble-icon-concept-social-media-message-communication-style_101434-586.jpg?w=800';

export const SPACES: Space[] = [
  { id: 'general', label: 'General', icon: 'globe', color: 'slate' },
  { id: 'tech', label: 'Tech', icon: 'cpu', color: 'blue' },
  { id: 'gaming', label: 'Gaming', icon: 'gamepad', color: 'indigo' },
  { id: 'school', label: 'School', icon: 'graduation', color: 'orange' },
  { id: 'memes', label: 'Memes', icon: 'shapes', color: 'pink' },
  { id: 'design', label: 'Design', icon: 'palette', color: 'teal' },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'u1',
    username: 'yaply',
    password: 'password', 
    displayName: 'Yaply HQ',
    bio: 'The heartbeat of the network. 🎙️',
    avatarUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200',
    following: ['u2', 'u3'],
    followers: [],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
    role: 'owner',
    isVerified: true
  },
  {
    id: 'u2',
    username: 'tech_guru',
    password: 'password',
    displayName: 'Silas V.',
    bio: 'Building the future, one line of code at a time. #TechLife',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
    following: [],
    followers: ['u1'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    role: 'user',
    isVerified: true
  },
  {
    id: 'u3',
    username: 'art_chic',
    password: 'password',
    displayName: 'Luna Design',
    bio: 'Colors speak louder than words. 🎨',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    bannerUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200',
    following: [],
    followers: ['u1'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    role: 'user'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    username: 'yaply',
    content: 'Welcome to the Community! 🎙️ This feed is now local-first. No cloud needed. Share your thoughts in #General or explore #Tech.',
    space: 'general',
    timestamp: Date.now() - 1000 * 60 * 60,
    reactions: { '❤️': ['u2', 'u3'], '🚀': ['u1'] },
    replies: [],
    isPinned: true
  },
  {
    id: 'p2',
    userId: 'u2',
    // Fixed missing opening quote for 'tech_guru'
    username: 'tech_guru',
    content: 'Just finished a new project using React 19. The performance is insane! 🚀 #Tech #Coding',
    space: 'tech',
    timestamp: Date.now() - 1000 * 60 * 30,
    reactions: { '🔥': ['u1'] },
    replies: [],
    isPinned: false
  }
];

export const MAX_CHARS = 280;
export const STORAGE_KEY_POSTS = 'yaply_posts_v9';
export const STORAGE_KEY_USERS = 'yaply_users_v9'; 
export const STORAGE_KEY_ME = 'yaply_me_id_v9';
export const THEME_STORAGE_KEY = 'yaply_theme_v9';
