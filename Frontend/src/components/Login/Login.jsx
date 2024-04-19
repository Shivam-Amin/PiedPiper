import React,{ useContext, useState } from 'react'
import '../../css/Login.css'
import InputControl from '../InputControl/InputControl.jsx'
import { Link, Navigate } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../firebase";
import { toast } from 'react-hot-toast';
import { Context, server } from '../../index.js';
import axios from 'axios';

const Login = () => {
  // const navigate = useNavigate(); 

  const {isAuth, setIsAuth, loading, setLoading} = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const [values,setValues] = useState({
  //     email:"",
  //     pass:"",
  // });
  const [errorMsg,setErrorMsg] = useState("");
  // const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = async (e)=>{
    e.preventDefault();
    setLoading(true);
    if(!email || !password){
      setErrorMsg("Fill all fields");
      return;
    }
    try {
      const { data } = await axios.post(`${server}/users/login`, {
      email,
      password
      }, {
        headers: {
        "Content-Type": "application/json"
        },
        withCredentials: true,
      })
      toast.success(data.message)
      setErrorMsg("");
      setIsAuth(true)
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setErrorMsg(error.response.data.message);
      setIsAuth(false)
      setLoading(false);
    }
  };

  // If the user is authenticated, navigate to the main page.
  if (isAuth) return <Navigate to={'/'} />

  return (
    <div className='container'>
      {/* <div className={styles.innerBox}> */}
      <form className='innerBox' onSubmit={handleSubmission}>
        <div className='img'>
          <img src="./1630583288170.jpg" alt='MY img'/>
        </div>
        <h1 className='heading'>Login</h1>

        <InputControl 
          tyep="text"
          label="Email" 
          placeholder="Enter email address"
          onChange={(e) => setEmail(e.target.value)}/>

        <InputControl 
          type="password"
          label="Password" 
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)} />

        <div className='footer'>
          <b className='error'>{errorMsg}</b>
          <button disabled={loading} type='Submit'>Login</button>

          <p>
            Already have an account?{" "}
            <span>
              <Link to="/signup">Sign up</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login;