import React, { createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import PrivateRoute from './components/PrivateRoute';
import Dashboard from "./components/Dashboard/Dashboard";

function App() {


  return (
    <Routes>
      <Route path="/"  element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    </Routes>
  );
}

export default App;