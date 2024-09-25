import axios from './axiosInstance';

export const fetchTodos = async () => {
  const response = await axios.get('/todos');
  return response.data;
};

export const addTodo = async (todo) => {
  const response = await axios.post('/todos', todo);
  return response.data;
};

export const updateTodoStatus = async (id, status) => {
  await axios.put(`/todos/${id}`, { status });
};

export const deleteTodo = async (id) => {
  await axios.delete(`/todos/${id}`);
};
