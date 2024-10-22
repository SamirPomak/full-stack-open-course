import { useDispatch } from 'react-redux';
import { newAnecdoteAction } from '../reducers/anecdoteReducer';

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnectode = (e) => {
    e.preventDefault();
    const anecdote = e.target.anecdote.value;
    e.target.anecdote.value = '';
    dispatch(newAnecdoteAction(anecdote));
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
