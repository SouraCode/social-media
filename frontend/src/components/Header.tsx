import { useState } from 'react';
import { Camera, PlusSquare, LogOut, User, Home, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CreatePost } from './CreatePost';

type HeaderProps = {
  onPostCreated: () => void;
  currentView: 'feed' | 'profile';
  onViewChange: (view: 'feed' | 'profile') => void;
};

export function Header({ onPostCreated, currentView, onViewChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Pixelgram</h1>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => onViewChange('feed')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  currentView === 'feed'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Feed</span>
              </button>
              <button
                onClick={() => onViewChange('profile')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  currentView === 'profile'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </nav>

            <button
              onClick={() => setShowCreatePost(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-md"
            >
              <PlusSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-semibold border-2 border-slate-300">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              <button
                onClick={signOut}
                className="text-slate-600 hover:text-slate-900 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {showCreatePost && (
        <CreatePost
          onPostCreated={() => {
            onPostCreated();
            setShowCreatePost(false);
          }}
          onClose={() => setShowCreatePost(false)}
        />
      )}
    </>
  );
}
