
import { UserProfile } from '../types';
import { STORAGE_KEY_USERS } from '../constants';

export async function login(email: string, passwordInput: string): Promise<UserProfile> {
  const saved = localStorage.getItem(STORAGE_KEY_USERS);
  const users: UserProfile[] = saved ? JSON.parse(saved) : [];
  
  // In this local version, we treat email as the username for simplicity
  const user = users.find(u => (u.username === email || u.id === email));
  
  if (!user) throw new Error("User not found locally.");
  
  // Note: In a real app we'd check the password hash
  return user;
}

export async function signUp(email: string, passwordInput: string, metadata: Partial<UserProfile>): Promise<UserProfile> {
  const newUser: UserProfile = {
    id: crypto.randomUUID(),
    username: metadata.username || email.split('@')[0],
    password: passwordInput, // Normally hashed
    displayName: metadata.displayName || metadata.username || 'New Yapper',
    avatarUrl: metadata.avatarUrl || `https://picsum.photos/seed/${metadata.username}/200`,
    bannerUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200',
    bio: metadata.bio || '',
    role: 'user',
    following: [],
    followers: [],
    isVerified: false,
    createdAt: Date.now()
  };

  const saved = localStorage.getItem(STORAGE_KEY_USERS);
  const users: UserProfile[] = saved ? JSON.parse(saved) : [];
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify([...users, newUser]));

  return newUser;
}

export async function logout() {
  localStorage.removeItem('yaply_me_id_v8');
}

export async function hashPassword(password: string): Promise<string> {
  return password; // Dummy for local version
}
