
import React, { useState, useEffect, useMemo } from 'react';
import { Post, UserProfile, ViewState, SortOrder } from './types';
import { THEME_STORAGE_KEY, STORAGE_KEY_ME, INITIAL_USERS, INITIAL_POSTS } from './constants';
import { CloudStorage } from './services/cloudStorage';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Sidebar from './components/Sidebar';
import SearchFilter from './components/SearchFilter';
import ProfileView from './components/ProfileView';
import Auth from './components/Auth';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  // --- STATE ---
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [me, setMe] = useState<UserProfile | null>(() => {
    const myId = localStorage.getItem(STORAGE_KEY_ME);
    return null; // Start logged out to ensure fresh sync
  });

  const [view, setView] = useState<ViewState>({ type: 'feed' });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // --- INITIAL CLOUD LOAD ---
  useEffect(() => {
    const loadInitialData = async () => {
      setIsSyncing(true);
      const [cloudPosts, cloudUsers] = await Promise.all([
        CloudStorage.fetchPosts(),
        CloudStorage.fetchUsers()
      ]);
      if (cloudPosts.length > 0) setPosts(cloudPosts);
      if (cloudUsers.length > 0) setUsers(cloudUsers);
      
      // Check if I exist in the cloud
      const myId = localStorage.getItem(STORAGE_KEY_ME);
      if (myId) {
        const foundMe = cloudUsers.find(u => u.id === myId);
        if (foundMe) setMe(foundMe);
      }
      setIsSyncing(false);
    };
    loadInitialData();
  }, []);

  // --- CLOUD POLLING (Check for new posts every 5s) ---
  useEffect(() => {
    const interval = setInterval(async () => {
      const cloudPosts = await CloudStorage.fetchPosts();
      if (cloudPosts.length > 0) {
        // Simple merge: prefer newest
        setPosts(prev => {
          const combined = [...cloudPosts];
          prev.forEach(p => {
            if (!combined.find(cp => cp.id === p.id)) combined.push(p);
          });
          return combined.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // --- PERSISTENCE ---
  useEffect(() => {
    if (me) localStorage.setItem(STORAGE_KEY_ME, me.id);
    else localStorage.removeItem(STORAGE_KEY_ME);
  }, [me]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // --- ACTIONS ---
  const handleAuth = async (user: UserProfile) => {
    setMe(user);
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    await CloudStorage.saveUsers(updatedUsers);
  };

  const addPost = async (content: string, spaceId: string = 'general') => {
    if (!me) return;
    const newPost: Post = {
      id: crypto.randomUUID(),
      userId: me.id,
      username: me.username,
      content,
      space: spaceId,
      timestamp: Date.now(),
      reactions: {},
      replies: [],
      isPinned: false
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    await CloudStorage.savePosts(updatedPosts);
  };

  const handleReaction = async (postId: string, emoji: string) => {
    if (!me) return;
    const nextPosts = posts.map(p => {
      if (p.id !== postId) return p;
      const current = p.reactions[emoji] || [];
      const newUsers = current.includes(me.id) 
        ? current.filter(id => id !== me.id) 
        : [...current, me.id];
      
      const nextReactions = { ...p.reactions };
      if (newUsers.length === 0) delete nextReactions[emoji];
      else nextReactions[emoji] = newUsers;
      
      return { ...p, reactions: nextReactions };
    });
    setPosts(nextPosts);
    await CloudStorage.savePosts(nextPosts);
  };

  const handleLogout = () => {
    setMe(null);
    setView({ type: 'feed' });
  };

  const handleProfileClick = (id: string) => {
    setView({ type: 'profile', profileId: id });
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- COMPUTED ---
  const trendingTags = useMemo(() => {
    const tagCounts: Record<string, number> = {};
    posts.forEach(p => {
      const tags = p.content.match(/#[a-z0-9_]+/gi) || [];
      tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1; });
    });
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count).slice(0, 5);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      result = result.filter(p => p.content.toLowerCase().includes(q) || p.username.toLowerCase().includes(q));
    }

    if (view.type === 'profile' && view.profileId) {
      result = result.filter(p => p.userId === view.profileId);
    } 
    else if (view.type === 'space' && view.spaceId) {
      result = result.filter(p => p.space === view.spaceId);
    }

    result.sort((a, b) => {
      if (sortOrder === 'popular') {
        const aCount = Object.values(a.reactions).flat().length;
        const bCount = Object.values(b.reactions).flat().length;
        return bCount - aCount;
      }
      return sortOrder === 'oldest' ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
    });

    return result;
  }, [posts, view, searchQuery, sortOrder]);

  if (!me) {
    return <Auth users={users} onLogin={handleAuth} onRegister={handleAuth} />;
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-[#020617] selection:bg-blue-500/30">
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={() => setIsDarkMode(prev => !prev)} 
        me={me} 
        onHome={() => { setView({ type: 'feed' }); setSearchQuery(''); }}
        onProfile={() => handleProfileClick(me.id)}
        onLogout={handleLogout}
        isSyncing={isSyncing}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4 shrink-0 hidden lg:block">
          <Sidebar 
            me={me} 
            posts={posts} 
            trendingTags={trendingTags}
            view={view}
            onViewChange={(v) => { setView(v); setSearchQuery(''); }}
            onEditProfile={() => handleProfileClick(me.id)}
            onTagClick={(tag) => setSearchQuery(tag)}
          />
        </aside>
        <section className="lg:w-2/4 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {view.type === 'profile' && view.profileId && !searchQuery ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ProfileView 
                  key={view.profileId}
                  user={users.find(u => u.id === view.profileId) || me} 
                  allUsers={users}
                  isMe={view.profileId === me.id}
                  isFollowing={me.following?.includes(view.profileId) || false}
                  onFollowToggle={() => {}} 
                  onUpdateProfile={() => {}}
                  onProfileClick={handleProfileClick}
                />
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {!searchQuery && <PostForm onPost={addPost} me={me} defaultSpace={view.type === 'space' ? view.spaceId : 'general'} />}
                <SearchFilter 
                  searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                  sortOrder={sortOrder} setSortOrder={setSortOrder}
                  activeFilter={null} clearFilter={() => setSearchQuery('')}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <PostList 
            posts={filteredPosts} users={users}
            currentUserId={me.id} onDelete={(id) => {
              const updated = posts.filter(x => x.id !== id);
              setPosts(updated);
              CloudStorage.savePosts(updated);
            }}
            onUpdate={(id, c) => {
              const updated = posts.map(x => x.id === id ? { ...x, content: c } : x);
              setPosts(updated);
              CloudStorage.savePosts(updated);
            }} 
            onReaction={handleReaction}
            onReply={() => {}} onProfileClick={handleProfileClick}
            onMentionClick={(val) => setSearchQuery(val)}
            viewType={view.type} spaceId={view.spaceId}
          />
        </section>
      </main>
    </div>
  );
};

export default App;
