import React, { Fragment, useContext } from 'react'

// import DisplayCard from "./DisplayCard/DisplayCard.jsx";
import { Context } from '../../index.js';
import Loading from '../Loading.jsx';
import { FaFolder } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";
import { HiOutlineDotsVertical } from "react-icons/hi";
import "../../css/DisplayCard.css";
import ContextMenu from "./ContextMenu";
import { HomeContext } from './Home.jsx';
import { useNavigate } from 'react-router-dom';
import "../../css/DisplayContainer.css";

const DisplayContainer = (props) => {

  const {loading, contextMenu, homeLoading, setHomeLoading } = useContext(Context);
  const {setRightClickOnFolder,
    handleContextMenu, handleItemClick, handleSingleClick, 
    setCmHeight} = useContext(HomeContext)
  const { folders, setFolderId, files, setFiles } = props

  if (homeLoading) {
    // console.log(homeLoading);
    return <Loading clr = {"gray"} />
  }
  return (
      <div id="container"  
        onClick={handleSingleClick} 
        onContextMenu={(e) => {
          setRightClickOnFolder(false)
          setCmHeight(101)
          handleContextMenu(e)
      }}>
        

        <Fragment>
              {/* {console.log(folders)} */}
              <div className="nav__container">
                { (folders.length !== 0)
                  ? ( <>
                      <p>Folders</p>
                      { folders.map((folder) => {
                        return (
                          <DisplayCard 
                            type="folder" 
                            key={folder._id}
                            name={folder.name} 
                            id={folder._id}
                            typeofClicked={folder.isFolder}
                            setFolderId={setFolderId}
                            handleSingleClick={handleSingleClick} 
                            handleContextMenu={handleContextMenu}
                            handleItemClick={handleItemClick} />

                        )
                      })}
                    </>
                  )
                  : null }
                  {(files.length !== 0)
                    ? ( <>
                      <p>Files</p>
                      { files.map((file) => {
                        return (
                          <DisplayCard 
                            type="file" 
                            key={file._id}
                            name={file.name} 
                            id={file._id}
                            typeofClicked={file.isFolder}
                            setFolderId={setFolderId}
                            handleSingleClick={handleSingleClick} 
                            handleContextMenu={handleContextMenu}
                            handleItemClick={handleItemClick} />
                        )
                      })}
                    </>
                    ) 
                    : null} 
                  {folders.length === 0 && files.length === 0 && <p>Empty!!</p>}
                
              </div>
            </Fragment>

        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          visible={contextMenu.visible}
          onItemClick={handleItemClick}
          isOpen={true}
        />
        
      </div>
  )
}

function DisplayCard(props) {

  const {type, name, id, typeofClicked, setFolderId, handleContextMenu} = props;
  // const {contextMenu, setContextMenu} = useContext(Context);
  const { setRightClickOnFolder, setRightClickOnFolderId,
    setCmHeight, isFolder, setIsFolder} = useContext(HomeContext)
  const navigate = useNavigate(); 
  

  const handleDoubleClick = async () => {
    // console.log(id);
    if (type !== 'file') {
      await setFolderId(id);
      navigate(`folder/${id}`)
    }
  }

  return (
    <div className="displayCard" 
      id={id} 
      onDoubleClick={(e) =>{
        e.preventDefault()
        handleDoubleClick()
      }}
      onContextMenu={(e) => {
        e.stopPropagation(); // Prevent the event from bubbling up to the parent
        setCmHeight(150)
        setRightClickOnFolder(true)
        setIsFolder(typeofClicked)
        handleContextMenu(e)
        setRightClickOnFolderId(id)
    }}>
      {
        (type === "folder")
        ? <FaFolder className="svg" />
        : <FaFileLines className="svg" />
      }
      <p>{name} </p>
      <input type="checkbox" />
      <label> 
        <HiOutlineDotsVertical className="svg" onClick={(e) => {
          e.stopPropagation(); // Prevent the event from bubbling up to the parent
          setCmHeight(150)
          setRightClickOnFolder(true)
          handleContextMenu(e)
          setRightClickOnFolderId(id)
        }}/> 
      </label>
    </div>
  );
}




export default DisplayContainer