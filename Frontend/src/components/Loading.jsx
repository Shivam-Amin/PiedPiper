import React from "react";
import ReactLoading from "react-loading";
import '../css/loading.css'

const Loading = ({clr}) => {
  // const {loading} = useContext(Context)
  const color = (clr) ? clr : '#fff'
  return (
    <div className="loading">
      <ReactLoading type="bubbles" color={color}
        height={100} width={50} />
    </div>
  );
}

export default Loading;