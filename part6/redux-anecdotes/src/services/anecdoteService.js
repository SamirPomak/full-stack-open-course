import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const asObject = (anecdote) => {
  return {
    content: anecdote,
    votes: 0,
  };
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (anecdote) => {
  const response = await axios.post(baseUrl, asObject(anecdote));
  return response.data;
};

const update = async (anecdote) => {
  const response = await axios.put(baseUrl + `/${anecdote.id}`, anecdote);
  return response.data;
};

export default { getAll, createNew, update };
