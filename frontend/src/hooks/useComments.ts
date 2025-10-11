import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsAPI } from '../lib/api';
import type { Comment } from '../lib/api';

export function useComments(postId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const data = await commentsAPI.getComments(postId);
      return data as Comment[];
    },
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      await commentsAPI.addComment(postId, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Add comment error:', error);
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      await commentsAPI.deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error('Delete comment error:', error);
    },
  });

  return {
    ...query,
    addComment,
    deleteComment,
  };
}
