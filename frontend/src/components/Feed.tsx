import { useEffect, useRef } from 'react';
import { usePosts } from '../hooks/usePosts';
import { PostCard } from './PostCard';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Feed() {
  const { user, loading: authLoading } = useAuth();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    toggleLike,
    toggleBookmark,
    deletePost,
  } = usePosts(); // No userId for feed - shows all posts

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLike = (postId: string, isLiked: boolean) => {
    toggleLike.mutate({ postId, isLiked });
  };

  const handleBookmark = (postId: string, isBookmarked: boolean) => {
    toggleBookmark.mutate({ postId, isBookmarked });
  };

  const handleDelete = (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost.mutate(postId);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <span className="ml-2 text-slate-500">Loading posts...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg">Please log in to view posts.</p>
        <p className="text-sm mt-2">Refresh the page if you're already logged in.</p>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg">No posts yet. Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onBookmark={handleBookmark}
          onDelete={handleDelete}
        />
      ))}

      <div ref={observerTarget} className="py-4">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        )}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-center text-slate-400 text-sm">
            You've reached the end
          </p>
        )}
      </div>
    </div>
  );
}
