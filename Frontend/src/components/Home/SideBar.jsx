import React, { useContext } from "react";
import drive from "../../assets/images.png";
import computers from "../../assets/computers.png";
import shared from "../../assets/shared.png";
import recent from "../../assets/recent.png";
import starred from "../../assets/starred.png";
import trash from "../../assets/trash.png";
import cloud from "../../assets/cloud.png";
import google from "../../assets/free-pied-piper-3628977-3030202.png";
// import { server } from "../../index.js";
import { HomeContext } from "./Home.jsx";
import "../../css/SideBar.css";
import { useNavigate } from "react-router-dom";


const SideBar = () => {
  // const [message, setMessage] = useState('');
  // const {setLoading, loading, contextMenu, setContextMenu} = useContext(Context);
  // const {contextMenuItems, setRightClickOnFolder,
  //   handleContextMenu, handleItemClick, handleSingleClick, 
  //   cmWidth, cmHeight, setCmHeight, createFolderOption,setCreateFolderOption } = useContext(HomeContext)
  const {setFolderId, setRightClickOnFolder, handleContextMenu, setCmHeight} = useContext(HomeContext)
  const navigate = useNavigate();



  return (
    <div>
      <div id="sideBar">
        <button id="uploadBtn" onClick={(e) => {
          setRightClickOnFolder(false)
          setCmHeight(101)
          handleContextMenu(e)
        }}
        onContextMenu={(e) => {
          setRightClickOnFolder(false)
          setCmHeight(101)
          handleContextMenu(e)
        }}>
          <img src={google} alt="upload img" />
          <p>New</p>
          {/* --------------------------------------------------------------------------------------------------- */}
        </button>
        
        <div id="sideBarOpt">
          <div className="sideBarOptions activeSideOpt"
            onClick={() => navigate('/')}>
            <img src={drive} alt="Reload page" className="opacity" />
            <h3>Home</h3>
          </div>

          <div className="sideBarOptions">
            <img src={computers} alt="Reload page" className="opacity" />
            <h3>Computers</h3>
          </div>

          <div className="sideBarOptions">
            <img src={shared} alt="Reload page" className="opacity" />
            <h3>Shared with me</h3>
          </div>

          <div className="sideBarOptions">
            <img src={recent} alt="Reload page" className="opacity" />
            <h3>Recent</h3>
          </div>

          <div className="sideBarOptions">
            <img src={starred} alt="Reload page" className="opacity" />
            <h3>Starred</h3>
          </div>

          <div className="sideBarOptions">
            <img src={trash} alt="Reload page" className="opacity" />
            <h3>Trash</h3>
          </div>
        </div>

        <div id="storageInfo">
          <div className="sideBarOptions">
            <img src={cloud} alt="Reload page" className="opacity" />
            <h3>Storage</h3>
          </div>

          <div className="sideBarOptions">
            <div id="storageLoader">
              <div id="preLoader"></div>
            </div>
          </div>

          <div id="storageNumericalInfo">
            <p>190 GB of 300 GB Used</p>
          </div>

          <button id="buyStorage">Buy storage</button>
        </div>

        <div id="sponsor">
          <p>Product by</p>
          <img src={google} alt='Reload page'/>
        </div>
      </div>
    </div>
  )
}

export default SideBar