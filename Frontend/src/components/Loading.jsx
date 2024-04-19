import React from "react";
import ReactLoading from "react-loading";
import '../css/loading.css'

const Loading = () => {
  // const {loading} = useContext(Context)
  
  return (
    <div className="loading">
      <ReactLoading type="bubbles" color="#fff"
        height={100} width={50} />
    </div>
  );
}

export default Loading;