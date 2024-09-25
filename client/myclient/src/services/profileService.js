import axios from './axiosInstance';

export const fetchProfile = async () => {
  const response = await axios.get('/profile');
  return response.data;
};

export const updateProfile = async (profile) => {
  await axios.put('/profile', profile);
};
