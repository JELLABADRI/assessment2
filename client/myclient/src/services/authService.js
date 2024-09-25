import axios from './axiosInstance';

export const loginUser = async (email, password) => {
  const response = await axios.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await axios.post('/auth/signup', { name, email, password });
  return response.data;
};
