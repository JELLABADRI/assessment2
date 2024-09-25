import React from 'react';
import { updateTodoStatus, deleteTodo } from '../../services/todoService';

function TodoItem({ todo, setTodos }) {
  const handleStatusChange = async (status) => {
    await updateTodoStatus(todo.id, status);
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? { ...t, status } : t)));
  };

  const handleDelete = async () => {
    await deleteTodo(todo.id);
    setTodos((prev) => prev.filter((t) => t.id !== todo.id));
  };

  return (
    <li>
      <span>{todo.title} - {todo.status}</span>
      <button onClick={() => handleStatusChange('completed')}>Complete</button>
      <button onClick={() => handleDelete()}>Delete</button>
    </li>
  );
}

export default TodoItem;
