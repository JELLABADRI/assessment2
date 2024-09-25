import React, { useEffect, useState } from 'react';
import { fetchTodos } from '../../services/todoService';
import AddTodo from './AddTodo';
import TodoItem from './TodoItem';

function TodoList() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const loadTodos = async () => {
      const data = await fetchTodos();
      setTodos(data);
    };
    loadTodos();
  }, []);

  return (
    <div>
      <h2>Todo List</h2>
      <AddTodo setTodos={setTodos} />
      <ul>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} setTodos={setTodos} />
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
