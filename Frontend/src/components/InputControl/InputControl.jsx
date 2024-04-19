import React from 'react'
import "../../css/InputControl.css"

export default function InputControl(props) {
  return (
    <div className='container2'>
        {props.label && <label>{props.label}</label>}
        <input {...props}/>
    </div>
  );
}
