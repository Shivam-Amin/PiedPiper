// import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Signup/Signup.jsx"
import { Toaster } from 'react-hot-toast';

// import { auth } from './firebase';
import { Context, server } from './index.js';
import axios from 'axios';

function App() {

  const {user, setUser, setIsAuth} = useContext(Context);
  const [userName, setUsername] = useState("");

  useEffect(() => {
    axios.get(`${server}/users/me`, {
      withCredentials: true,
    })
    .then((res) => {
      setUser(res.data.user);
      setIsAuth(true)
    })
    .catch((error) => {
      setUser({});
      setIsAuth(false)
    })
  }, [])

  return (
    <div className="App">
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/signup' element={<Signup />}/>
          </Routes>
          <Toaster toastOptions={{
              style: {
                background: '#333',
                color: 'whitesmoke',
                fontSize: '14px',
              }
            }} />
        </Router>
      </div>
    </div>
  );
}

export default App;
