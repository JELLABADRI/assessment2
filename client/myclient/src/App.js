import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import TodoList from './components/todos/TodoList';
import Profile from './components/profile/Profile';

function App() {
  return (
    <div>
      <h1>Todo Application</h1>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<TodoList />} /> {/* Default route */}
      </Routes>
    </div>
  );
}

export default App;
