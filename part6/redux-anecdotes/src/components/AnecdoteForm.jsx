import { useDispatch } from 'react-redux';
import { newAnecdoteAction } from '../reducers/anecdoteReducer';
import {
  removeNotification,
  setNotification,
} from '../reducers/notificationReducer';
import anecdoteService from '../services/anecdoteService';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnectode = async (e) => {
    e.preventDefault();
    const anecdote = e.target.anecdote.value;
    e.target.anecdote.value = '';
    const newAnecdote = await anecdoteService.createNew(anecdote);
    dispatch(newAnecdoteAction(newAnecdote));
    dispatch(setNotification(`You added ${anecdote}`));
    setTimeout(() => {
      dispatch(removeNotification());
    }, 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnectode}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
