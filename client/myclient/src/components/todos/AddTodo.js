import React, { useState } from 'react';
import { addTodo } from '../../services/todoService';

function AddTodo({ setTodos }) {
  const [title, setTitle] = useState('');

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const newTodo = await addTodo({ title, status: 'pending' });
    setTodos((prev) => [...prev, newTodo]);
    setTitle('');
  };

  return (
    <form onSubmit={handleAddTodo}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Todo"
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddTodo;
