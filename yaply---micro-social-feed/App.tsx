
import React, { useState, useEffect, useMemo } from 'react';
import { Post, UserProfile, ViewState, SortOrder } from './types';
import { THEME_STORAGE_KEY, STORAGE_KEY_POSTS, STORAGE_KEY_USERS, STORAGE_KEY_ME, INITIAL_POSTS, INITIAL_USERS } from './constants';
import Header from './components/Header';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import Sidebar from './components/Sidebar';
import SearchFilter from './components/SearchFilter';
import ProfileView from './components/ProfileView';
import Auth from './components/Auth';

const App: React.FC = () => {
  // --- STATE ---
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_POSTS);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [me, setMe] = useState<UserProfile | null>(() => {
    const myId = localStorage.getItem(STORAGE_KEY_ME);
    const savedUsers = localStorage.getItem(STORAGE_KEY_USERS);
    if (myId && savedUsers) {
      const allUsers = JSON.parse(savedUsers);
      return allUsers.find((u: any) => u.id === myId) || null;
    }
    return null;
  });

  const [view, setView] = useState<ViewState>({ type: 'feed' });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

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
  const handleAuth = (user: UserProfile) => {
    setUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (exists) return prev;
      return [...prev, user];
    });
    setMe(user);
  };

  const addPost = (content: string, spaceId: string = 'general') => {
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
    setPosts(prev => [newPost, ...prev]);
  };

  const handleReaction = (postId: string, emoji: string) => {
    if (!me) return;
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const current = p.reactions[emoji] || [];
      const newUsers = current.includes(me.id) 
        ? current.filter(id => id !== me.id) 
        : [...current, me.id];
      
      const nextReactions = { ...p.reactions };
      if (newUsers.length === 0) delete nextReactions[emoji];
      else nextReactions[emoji] = newUsers;
      
      return { ...p, reactions: nextReactions };
    }));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const updatePost = (id: string, newContent: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, content: newContent } : p));
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
    <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-[#020617]">
      <Header 
        isDarkMode={isDarkMode} 
        onToggleTheme={() => setIsDarkMode(prev => !prev)} 
        me={me} 
        onHome={() => { setView({ type: 'feed' }); setSearchQuery(''); }}
        onProfile={() => handleProfileClick(me.id)}
        onLogout={handleLogout}
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
          {view.type === 'profile' && view.profileId && !searchQuery ? (
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
          ) : (
            <>
              {!searchQuery && <PostForm onPost={addPost} me={me} defaultSpace={view.type === 'space' ? view.spaceId : 'general'} />}
              <SearchFilter 
                searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                activeFilter={null} clearFilter={() => setSearchQuery('')}
              />
            </>
          )}
          
          <PostList 
            posts={filteredPosts} users={users}
            currentUserId={me.id} onDelete={deletePost}
            onUpdate={updatePost} onReaction={handleReaction}
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
