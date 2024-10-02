import axios from 'axios';
const baseUrl = '/api/login';

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};
const getCurrentLoggedInUser = () => {
  return JSON.parse(localStorage.getItem('loggedBlogsUser'));
};

export default { login, getCurrentLoggedInUser };
