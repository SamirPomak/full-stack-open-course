import { useDispatch, useSelector } from 'react-redux';
import { voteAction } from '../reducers/anecdoteReducer';
import Anecdote from './Anecdote';
import {
  removeNotification,
  setNotification,
} from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const anecdotes = useSelector((state) =>
    state.anecdotes.filter((a) =>
      a.content.toLowerCase().includes(state.filter.toLowerCase())
    )
  );
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteAction(id));
    const anecdote = anecdotes.find((a) => a.id === id);
    dispatch(setNotification(`You voted ${anecdote.content}`));
    setTimeout(() => {
      dispatch(removeNotification());
    }, 5000);
  };
  return (
    <>
      {anecdotes
        .toSorted((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <Anecdote key={anecdote.id} anecdote={anecdote} vote={vote} />
        ))}
    </>
  );
};

export default AnecdoteList;
