// import logo from './logo.svg';
import './App.css';
import { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Signup/Signup.jsx"
import { Toaster } from 'react-hot-toast';

// import { auth } from './firebase';
import { Context, server } from './index.js';
import axios from 'axios';
import Loading from './components/Loading.jsx';

const SessionStorageUpdater = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const getLastRoute = async () => {
      if (!hasRedirected) {
        console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        const lastRoute = await sessionStorage.getItem('lastVisitedRoute');
        if (window.location.pathname == '/' && (lastRoute !== '/' && lastRoute !== '/login' && lastRoute !== '/signup')) {
          console.log('alsdkfjlsdflskjdflkj');
          navigate(lastRoute);
        }
        setHasRedirected(true); 
      }
    }
    getLastRoute();
  }, [navigate, hasRedirected]);

  useEffect(() => {
    // Store the current path in session storage
    sessionStorage.setItem('lastVisitedRoute', location.pathname);
  }, [location]);

  return null; // No visible output
};

function App() {

  const {user, setUser, isAuth, setIsAuth, loading, setLoading} = useContext(Context);
  const [userName, setUsername] = useState("");
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${server}/users/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
        setIsAuth(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser({});
        setIsAuth(false);
      } finally {
        setLoading(false); // Set loading to false when fetch is complete
      }
    };
  
    fetchUser();
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className="App">
        <Router>
        <SessionStorageUpdater /> 
          <Routes>
          <Route
            path="/"
            element={isAuth ? <Home /> : <Navigate to="/login" />} // Redirect if not authenticated
          >
            <Route
              path="folder/:parameter_id"
              element={<Home />}
            />
          </Route>
          <Route
            path="/login"
            element={isAuth ? <Navigate to="/" /> : <Login />} // Redirect if already authenticated
          />
          <Route path="/signup" element={<Signup />} />
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
  );
}

export default App;
