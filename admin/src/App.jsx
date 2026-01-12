import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate  } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login'
import { ToastContainer } from "react-toastify";



export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency ='₹'



  const App = () => {
  const [token, setToken] = useState(
  localStorage.getItem("adminToken")
);
  
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer/>
      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="flex-1 mx-8 my-8 text-gray-700 text-base">
              <Routes>
                  <Route path="/" element={<Navigate to="/add" />} />
                <Route path="/add" element={<Add token={token}/>} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
