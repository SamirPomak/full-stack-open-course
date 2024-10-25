import { createSlice } from '@reduxjs/toolkit';

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

export const { voteAction, newAnecdoteAction, setAnectodes } =
  anecdotesSlice.actions;

export default anecdotesSlice.reducer;
