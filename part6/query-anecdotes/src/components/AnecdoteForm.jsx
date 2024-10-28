import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../services/requests';
import { useNotificationDispatch } from '../contexts/hooks';

const AnecdoteForm = () => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (anecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] });
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Anecdote '${anecdote.content}' created!`,
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },

    onError: (error) => {
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: error.response.data.error,
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    newAnecdoteMutation.mutate({ content, votes: 0 });
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
