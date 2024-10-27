import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdoteService';

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAction(state, action) {
      const anecdote = state.find((a) => a.id === action.payload);
      anecdote.votes += 1;
    },
    newAnecdoteAction(state, action) {
      state.push(action.payload);
    },
    setAnectodes(state, action) {
      return action.payload;
    },
  },
});

export const { newAnecdoteAction, setAnectodes } = anecdotesSlice.actions;

export const initializeNotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnectodes(anecdotes));
  };
};

export const createAnectode = (anecdote) => {
  return async (dispatch) => {
    const newAnectode = await anecdoteService.createNew(anecdote);
    dispatch(newAnecdoteAction(newAnectode));
  };
};

export const voteForAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdote = getState().anecdotes.find((a) => a.id === id);
    console.log(anecdote);

    await anecdoteService.update({ ...anecdote, votes: anecdote.votes + 1 });
    dispatch(anecdotesSlice.actions.voteAction(id));
  };
};

export default anecdotesSlice.reducer;
