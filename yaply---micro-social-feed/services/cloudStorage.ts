
import { Post, UserProfile } from '../types';
import { CLOUD_API_URL } from '../constants';

export const CloudStorage = {
  // Fetch all posts from the global cloud
  async fetchPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${CLOUD_API_URL}/posts`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn("Cloud offline, using empty feed.");
      return [];
    }
  },

  // Save all posts to the global cloud
  async savePosts(posts: Post[]): Promise<void> {
    try {
      await fetch(`${CLOUD_API_URL}/posts`, {
        method: 'POST',
        body: JSON.stringify(posts.slice(0, 50)), // Limit to 50 for free tier speed
      });
    } catch (e) {
      console.error("Cloud save failed:", e);
    }
  },

  // Fetch all registered users
  async fetchUsers(): Promise<UserProfile[]> {
    try {
      const response = await fetch(`${CLOUD_API_URL}/users`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  },

  // Register/Update a user in the cloud
  async saveUsers(users: UserProfile[]): Promise<void> {
    try {
      await fetch(`${CLOUD_API_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(users),
      });
    } catch (e) {
      console.error("User sync failed:", e);
    }
  }
};
