import React, { useState, createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

export const server = "http://localhost:5000/api/v1";
export const Context = createContext({isAuth: false})

const AppWrapper = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({})
  const [isOpen, setIsOpen] = useState("none")
  const [homeLoading, setHomeLoading] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  return (
    <Context.Provider
      value={{
        isAuth, setIsAuth,
        loading, setLoading,
        user, setUser,
        isOpen, setIsOpen,
        contextMenu, setContextMenu,
        homeLoading, setHomeLoading
      }}>
      <App />
    </Context.Provider>
  )
}

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
