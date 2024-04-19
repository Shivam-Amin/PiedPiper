import React, { useContext, useState } from 'react'
import '../../css/Signup.css'
import InputControl from '../InputControl/InputControl.jsx'
import { Link, Navigate } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
// import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
// import { auth } from "../../firebase";
import { Context, server } from '../../index.js';
import axios from 'axios';
import { toast } from 'react-hot-toast';


export default function Signup() {
  // const navigate = useNavigate(); 
  // const [values,setValues] = useState({
  //     name:"",
  //     email:"",
  //     pass:"",
  // });
  // const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    
  const {isAuth, setIsAuth, loading, setLoading} = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg,setErrorMsg] = useState("");


  const handleSubmission = async (e) => {
    e.preventDefault();
    setLoading(true);
    if(!name || !email || !password){
      setErrorMsg("Fill all fields");
      return;
    }
    try {
      const { data } = await axios.post(`${server}/users/register`, {
        name, email, password
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      })
      toast.success(data.message)
      setErrorMsg("");
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setErrorMsg(error.response.data.message);
      setIsAuth(false);
      setLoading(false);
    }
  };

  // If the user is authenticated, navigate to the main page.
  if (isAuth) return <Navigate to={'/'} />

  return (
    <div className='container'>
      <form className='innerBox' onSubmit={handleSubmission}>
        <div className='img'>
          <img src="./1630583288170.jpg" alt='MY img'/>
        </div>
        <h1 className='heading'>Sign up</h1>
        <InputControl 
          label="Name" 
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
        <InputControl 
          label="Email" 
          placeholder="Enter email address"
          onChange={(e)=>setEmail(e.target.value)}
        />
        <InputControl 
          type="password"
          label="Password" 
          placeholder="Enter password"
          onChange={(e)=>setPassword(e.target.value)}/>

        <div className='footer'>
          <b className='error'>{errorMsg}</b>
          <button disabled={loading} type='Submit'>Signup</button>
          <p>
            Already have an account?{" "}
            <span>
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </form>
    </div>
  )
}
