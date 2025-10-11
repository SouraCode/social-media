import { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Trash2 } from 'lucide-react';
import type { Post } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { CommentsModal } from './CommentsModal';

type PostCardProps = {
  post: Post;
  onLike: (postId: string, isLiked: boolean) => void;
  onBookmark: (postId: string, isBookmarked: boolean) => void;
  onDelete: (postId: string) => void;
};

export function PostCard({ post, onLike, onBookmark, onDelete }: PostCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
  };

  const isOwner = user?.id === post.user_id;

  const handleDelete = () => {
    console.log('Delete clicked for post', post.id);
    if (confirm('Are you sure you want to delete this post?')) {
      console.log('Confirmed, deleting post', post.id);
      onDelete(post.id);
      setShowMenu(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <>
      <article className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between p-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-semibold">
              {post.profiles.avatar_url ? (
                <img
                  src={post.profiles.avatar_url}
                  alt={post.profiles.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                post.profiles.full_name[0].toUpperCase()
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{post.profiles.username}</p>
              <p className="text-xs text-slate-500">{timeAgo(post.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                console.log('3dot clicked');
                setShowMenu(!showMenu);
              }}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {showMenu && (
              <div ref={menuRef} className="absolute top-12 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                {isOwner && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="relative bg-slate-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={post.image_url}
            alt="Post"
            className={`w-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ maxHeight: '600px' }}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onLike(post.id, post.is_liked)}
                className="group flex items-center gap-1 transition-transform active:scale-90"
              >
                <Heart
                  className={`w-6 h-6 transition-colors ${
                    post.is_liked
                      ? 'fill-red-500 text-red-500'
                      : 'text-slate-700 group-hover:text-red-500'
                  }`}
                />
                <span className="text-sm font-semibold text-slate-900">
                  {post.likes_count}
                </span>
              </button>
              <button
                onClick={() => setShowComments(true)}
                className="group flex items-center gap-1 transition-transform active:scale-90"
              >
                <MessageCircle className="w-6 h-6 text-slate-700 group-hover:text-slate-900 transition-colors" />
                <span className="text-sm font-semibold text-slate-900">
                  {post.comments_count}
                </span>
              </button>
            </div>
            <button
              onClick={() => onBookmark(post.id, post.is_bookmarked)}
              className="transition-transform active:scale-90"
            >
              <Bookmark
                className={`w-6 h-6 transition-colors ${
                  post.is_bookmarked
                    ? 'fill-slate-900 text-slate-900'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              />
            </button>
          </div>

          {post.caption && (
            <div className="text-sm">
              <span className="font-semibold text-slate-900 mr-2">
                {post.profiles.username}
              </span>
              <span className="text-slate-700">{post.caption}</span>
            </div>
          )}
        </div>
      </article>

      {showComments && (
        <CommentsModal
          post={post}
          onClose={() => setShowComments(false)}
        />
      )}
    </>
  );
}
