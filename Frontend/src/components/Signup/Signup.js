import React, { useState } from 'react'
import styles from './Signup.module.css'
import InputControl from '../InputControl/InputControl'
import { Link,useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword,updateProfile } from "firebase/auth";
import { auth } from "../../firebase";

export default function Signup() {
    const navigate = useNavigate(); 
    const [values,setValues] = useState({
        name:"",
        email:"",
        pass:"",
    });
    const [errorMsg,setErrorMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleSubmission = ()=>{
        if(!values.name || !values.email || !values.pass){
            setErrorMsg("Fill all fields");
            return;
        }
        setErrorMsg("");
        // console.log(values);
        // FIREBASE USER CREATION
        setSubmitButtonDisabled(true);
        createUserWithEmailAndPassword(auth,values.email,values.pass).then(async(res)=>{
            setSubmitButtonDisabled(false);
            const user =res.user;
            await updateProfile(user ,{
                displayName: values.name,
            });
            navigate("/");
            // console.log(user);
        })
        .catch((err)=> {
            setSubmitButtonDisabled(false);
            setErrorMsg(err.message);
        });
    };
  return (
    <div className={styles.container}>
        <div className={styles.innerBox}>
            <div className={styles.img}>
            <img src="./1630583288170.jpg" alt='MY img'/>
            </div>
            <h1 className={styles.heading}>Sign up</h1>
            <InputControl 
            label="Name" 
            placeholder="Enter email name"
            onChange={(event)=>setValues((prev)=>({...prev,name: event.target.value}))}
            />
            <InputControl 
            label="Email" 
            placeholder="Enter email address"
            onChange={(event)=>setValues((prev)=>({...prev,email: event.target.value}))}
            />
            <InputControl 
            label="Password" 
            placeholder="Enter password"
            onChange={(event)=>setValues((prev)=>({...prev,pass: event.target.value}))}/>

            <div className={styles.footer}>
                <b className={styles.error}>{errorMsg}</b>
                <button onClick={handleSubmission} disabled={submitButtonDisabled}>Signup</button>
                <p>
                    Already have an account?{" "}
                    <span>
                        <Link to="/login">Login</Link>
                    </span>
                </p>
            </div>
        </div>
    </div>
  )
}
