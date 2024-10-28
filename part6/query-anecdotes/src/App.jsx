import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { getAnecdotes, updateAnecdote } from './services/requests';
import { useNotificationDispatch } from './contexts/hooks';

const App = () => {
  const dispatch = useNotificationDispatch();
  const {
    isPending,
    isError,
    data: anecdotes,
  } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const queryClient = useQueryClient();
  const upvoteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (upvotedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      queryClient.setQueryData(
        ['anecdotes'],
        anecdotes.map((anecdote) => {
          if (anecdote.id === upvotedAnecdote.id) {
            return upvotedAnecdote;
          }

          return anecdote;
        })
      );
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: `Anecdote '${upvotedAnecdote.content}' voted!`,
      });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
  });

  const handleVote = (anecdote) => {
    upvoteAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  if (isPending) {
    return <div>Loading anecdotes...</div>;
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
