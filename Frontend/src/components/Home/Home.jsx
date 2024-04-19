import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { Context, server } from '../../index.js';
import Navbar from './Navbar.jsx';
// import { Link,useNavigate } from 'react-router-dom'
import '../../css/Home.css'
import SideBar from './SideBar.jsx';
import DisplayContainer from './DisplayContainer.jsx';


const Home = (props) => {

  const {user, setUser, setIsAuth, isAuth, setLoading, loading} = useContext(Context);
  const [folderId, setFolderId] = useState(null);
  const [folders, setFolders] = useState(null);
  const [files, setFiles] = useState(null);

  useEffect( () => {
    setLoading(true)
    console.log(`folderId: ${folderId}`);
    const  getFolderData = async () => {
      const {data} = await axios.get(`${server}/data/folder/get/${folderId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "applicaiton/json"
        }
      })
      console.log(data);
      setFolders(data.folders);
    }
    getFolderData();
    setLoading(false);
  }, [folderId])

  if (!isAuth) return <Navigate to={'/login'} />

  return (
    <div className='home'>
      <Navbar />
      <div className="mainCont">
        <SideBar/>
        <DisplayContainer folders={folders} setFolderId={setFolderId} />
      </div>
    </div>
  )
}

export default Home