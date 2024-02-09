import React,{ useState } from 'react'
import styles from './Login.module.css'
import InputControl from '../InputControl/InputControl'
import { Link,useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";


export default function Login() {
    const navigate = useNavigate(); 
    const [values,setValues] = useState({
        email:"",
        pass:"",
    });
    const [errorMsg,setErrorMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

    const handleSubmission = ()=>{
        if(!values.email || !values.pass){
            setErrorMsg("Fill all fields");
            return;
        }
        setErrorMsg("");
        // console.log(values);
        // FIREBASE USER CREATION
        setSubmitButtonDisabled(true);
        signInWithEmailAndPassword(auth,values.email,values.pass).then(async(res)=>{
            setSubmitButtonDisabled(false);
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
            <h1 className={styles.heading}>Login</h1>
            <InputControl 
            label="Email" 
            placeholder="Enter email address"
            onChange={(event) => setValues((prev) =>({...prev,email: event.target.value}))}/>
            <InputControl 
            label="Password" 
            placeholder="Enter password"
            onChange={(event) => setValues((prev) =>({...prev,pass: event.target.value}))}/>

            <div className={styles.footer}>
                <b className={styles.error}>{errorMsg}</b>
                <button disabled={submitButtonDisabled} onClick={handleSubmission}>Login</button>
                <p>
                    Already have an account?{" "}
                    <span>
                        <Link to="/signup">Sign up</Link>
                    </span>
                </p>
            </div>
        </div>
    </div>
  )
}
