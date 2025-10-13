import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsAPI, likesAPI, bookmarksAPI } from '../lib/api';
import type { Post } from '../lib/api';

const POSTS_PER_PAGE = 10;

export function usePosts(userId?: string) {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['posts', userId],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * POSTS_PER_PAGE;
      const posts = await postsAPI.getPosts(POSTS_PER_PAGE, offset, userId);

      return {
        posts,
        nextPage: posts.length === POSTS_PER_PAGE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: userId !== undefined, // Only fetch when userId is defined
  });

  const toggleLike = useMutation({
    mutationFn: async ({ postId, isLiked }: { postId: string; isLiked: boolean }) => {
      if (isLiked) {
        await likesAPI.unlikePost(postId);
      } else {
        await likesAPI.likePost(postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Toggle like error:', error);
    },
  });

  const toggleBookmark = useMutation({
    mutationFn: async ({ postId, isBookmarked }: { postId: string; isBookmarked: boolean }) => {
      if (isBookmarked) {
        await bookmarksAPI.unbookmarkPost(postId);
      } else {
        await bookmarksAPI.bookmarkPost(postId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Toggle bookmark error:', error);
    },
  });

  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      await postsAPI.deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Delete post error:', error);
    },
  });

  return {
    ...query,
    toggleLike,
    toggleBookmark,
    deletePost,
  };
}
