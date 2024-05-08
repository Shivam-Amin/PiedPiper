import React, { Fragment, createContext, useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import axios from 'axios'
import { Context, server } from '../../index.js';
import Navbar from './Navbar.jsx';
import SideBar from './SideBar.jsx';
import DisplayContainer from './DisplayContainer.jsx';
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { IoMdTrash } from "react-icons/io";
import { MdFileDownload } from "react-icons/md";
import { MdUploadFile } from "react-icons/md";
import toast from 'react-hot-toast';
import { CreateFolderModel } from './Models/CreateFolderModel.jsx';
import { FileUploadModel } from './Models/FileUploadModel.jsx';
import Loading from '../Loading.jsx';
import list_view from "../../assets/list_view.jpg";
import info from "../../assets/info.png";
import '../../css/Home.css'

export const HomeContext = createContext({})

const Home = (props) => {
  const location = useLocation();
  const { parameter_id } = useParams();
  const {setLoading, loading, setContextMenu, homeLoading, setHomeLoading} = useContext(Context);
  
  const [folderId, setFolderId] = useState(parameter_id || null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [rightClickOnFolder, setRightClickOnFolder] = useState(false);
  const [rightClickOnFolderId, setRightClickOnFolderId] = useState(null);
  const [isFolder, setIsFolder] = useState(false);

  const [createFolderOption, setCreateFolderOption] = useState(false);
  const [renameFolderOption, setRenameFolderOption] = useState(false);
  const [fileUploadOption, setFileUploadOption] = useState(false);

  const contextMenuItems = [

    {img: <MdDriveFileRenameOutline />, title: "Rename"},
    {img: <MdFileDownload />, title: "Download"},
    {img: <MdOutlineCreateNewFolder />, title: "Create folder"},
    {img: <MdUploadFile />, title: "Upload file"},
    {img: <IoMdTrash />, title: "Delete"}
  ]
  // context Menu width and height
  const cmWidth=175;
  // const [cmWidth, setCmWidth] = useState(175);
  const [cmHeight, setCmHeight] = useState(150);

  useEffect(() => {
    // Handle changes in location
    setHomeLoading(true);
    const handleLocationChange = async () => {
      console.log('Location changed to:', location.pathname);

      // Custom logic when back button is pressed
      // For example, you can redirect or prevent certain actions
      if (location.pathname === '/') {
        await setFolderId(null)
      }
      if (location.pathname === `/folder/${parameter_id}`) {
        await setFolderId(parameter_id)
        console.log(`fas;ldfjs;kdfj:   ${parameter_id}`);
      }
    };

    handleLocationChange(); // Run on mount to capture the initial state
    if (parameter_id) {
      setFolderId(parameter_id)
    }
    setHomeLoading(false)
  }, [parameter_id, location]); 


  useEffect( () => {
    // console.log(`folderId: ${folderId}`);
    // setHomeLoading(true);
    
    const  getFolderData = async () => {
      const {data} = await axios.get(`${server}/data/folder/get/${folderId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "applicaiton/json"
        }
      })
      // console.log(data);
      const f = data.folders;
      console.log(f);
      await setFolders(f);
    }
    const  getFileData = async () => {
      // await setHomeLoading(true);
      const {data} = await axios.get(`${server}/data/file/get/${folderId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "applicaiton/json"
        }
      })
      // console.log(data);
      const f = data.files;
      console.log(f);
      await setFiles(f);
    }
    getFolderData();
    getFileData();
    // setHomeLoading(false);
  }, [homeLoading, folderId])

  const createFolder = async (name) => {
    try {
      // parentId = parentId ? parentId : null
      await setHomeLoading(true);
      const { data } = await axios.post(`${server}/data/folder/add`, {
        "folderName": name,
        "parentId": folderId,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      // setFolders([...folders, ])
      toast.success(data.message)
      // console.log(data);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      await setHomeLoading(false);
    }
  }

  const renameFolder = async (name) => {
    try {
      // parentId = parentId ? parentId : null
      await setHomeLoading(true);
      const { data } = await axios.post(`${server}/data/folder/update`, {
        "folderId": rightClickOnFolderId,
        "parentId": folderId,
        "updatedName": name,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })
      // setFolders([...folders, ])
      toast.success(data.message)
      // console.log(data);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      await setHomeLoading(false);
    }
  }

  const deleteFolder = async (rightClickOnFolderId) => {
    try {
      await setHomeLoading(true)
      const { data } = await axios.get(`${server}/data/folder/delete/${rightClickOnFolderId}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      })

      toast.success(data.message)

      await setHomeLoading(false)
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      await setHomeLoading(false)
    }
  }

  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent the default browser context menu
    let x = e.pageX, y = e.pageY,
    winWidth = window.innerWidth,
    winHeight = window.innerHeight

    x = x > (winWidth - cmWidth) ? (winWidth - cmWidth) : x;
    y = y > (winHeight - cmHeight) ? (winHeight - cmHeight) : y;

    setContextMenu({
      visible: true,
      x: x, y: y,
    });
  };

  const handleDownload = async (fileId) => {
    const f = files.find((file) => file._id === fileId);
    const furl = f.url
    const name = f.name

    const response = await axios.get(furl, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url); // Clean up the object URL

    // let options = {
    //   url: f.url,
    //   filename: f.name, // Suggested filename for download
    //   conflictAction: "uniquify", // Strategy to handle name conflicts
    //   saveAs: true, // Set to true to prompt the user with a "Save As" dialog
    // };
    
    // browser.downloads
    // .download(options)
    // .then((downloadId) => {
    //   console.log("Download initiated with ID:", downloadId);
    // })
    // .catch((error) => {
    //   console.error("Error initiating download:", error);
    // });
  };

  const handleItemClick = async(item) => {
    // alert(`Clicked on: ${item}`);
    // await setHomeLoading(true)
    console.log(item);
    if (item.toLowerCase().includes("create")) {
      setCreateFolderOption(true);
    }
    if (item.toLowerCase().includes("rename")) {
      setRenameFolderOption(true);
    }
    if (item.toLowerCase().includes("upload")) {
      setFileUploadOption(true);
    }
    if (item.toLowerCase().includes("delete")) {
      deleteFolder(rightClickOnFolderId);
    }
    if (item.toLowerCase().includes("download")) {
      handleDownload(rightClickOnFolderId);
    }
    // await setHomeLoading(false)
  };

  const handleSingleClick = () => {
    setContextMenu({
      visible: false,
      x: 0, y: 0,
    });
  };


  if (loading) {
    return <Loading />
  }

  return (
    <HomeContext.Provider 
      value={{
        folderId, setFolderId,
        isFolder, setIsFolder,
        contextMenuItems,
        rightClickOnFolder, setRightClickOnFolder,
        rightClickOnFolderId, setRightClickOnFolderId,
        handleContextMenu,
        handleItemClick,
        handleSingleClick,
        createFolderOption, setCreateFolderOption,
        renameFolderOption, setRenameFolderOption,
        cmWidth,
        cmHeight, setCmHeight,
    }}>
      <div className='home'>
        <Navbar />
        <div className="mainCont">
          <SideBar/>
          <div className="addFlex">
            <div id="header__container">
              <p>Home</p>

              <button>
                <img src={list_view} alt="Reload page" className="opacity" />
              </button>

              <button>
                <img src={info} alt="Reload page" className="opacity" />
              </button>
            </div>
            <DisplayContainer 
              folders={folders} 
              setFolderId={setFolderId} 
              files={files}
              setFiles={setFiles} />
          </div>
          {createFolderOption && 
          <CreateFolderModel loading={loading} 
            setLoading={setLoading} 
            setCreateFolderOption={setCreateFolderOption}
            createFolderOption={createFolderOption}
            createFolder={createFolder} /> }

          {renameFolderOption && 
          <CreateFolderModel loading={loading} 
            setLoading={setLoading} 
            setCreateFolderOption={setRenameFolderOption}
            createFolderOption={renameFolderOption}
            createFolder={renameFolder} /> }
          
          {fileUploadOption && 
          <FileUploadModel loading={loading}
            setLoading={setLoading}
            setFileUploadOption={setFileUploadOption}
            fileUploadOption={fileUploadOption} /> }
        </div>
      </div>
    </HomeContext.Provider>
  )
}



export default Home