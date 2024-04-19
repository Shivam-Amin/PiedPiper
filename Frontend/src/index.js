import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import { createContext } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));

export const server = "http://localhost:5000/api/v1";
export const Context = createContext({isAuth: false})

const AppWrapper = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const [isOpen, setIsOpen] = useState("none")

  return (
    <Context.Provider
      value={{
        isAuth,
        setIsAuth,
        loading,
        setLoading,
        user, 
        setUser,
        isOpen,
        setIsOpen,
      }}>
      <App />
    </Context.Provider>
  )
}

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
  document.getElementById('root')
);
