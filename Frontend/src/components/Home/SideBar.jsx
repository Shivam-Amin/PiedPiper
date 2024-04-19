import React, { useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";
import { IoCheckmarkSharp } from "react-icons/io5";
import drive from "../../assets/images.png";
import computers from "../../assets/computers.png";
import shared from "../../assets/shared.png";
import recent from "../../assets/recent.png";
import starred from "../../assets/starred.png";
import trash from "../../assets/trash.png";
import cloud from "../../assets/cloud.png";
import google from "../../assets/free-pied-piper-3628977-3030202.png";
import UploadModal from "./UploadModal.jsx";
import { server } from "../../index.js";
import "../../css/SideBar.css";


const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([{name:'file1', size:'15MB', loading:'20'}])
  const [uploadedFiles, setUploadedFiles] = useState([{name:'file2', size:'10MB', loading:'34'}])
  const [showProgress, setShowProgress] = useState(true)
  const fileInputRef = useRef(null)

  const sendFiles = async () => {
    const myFiles = document.getElementById('myFiles').files;
    const formData = new FormData();
    Object.keys(myFiles).forEach((key) => {
      formData.append(myFiles.item(key).name, myFiles.item(key));
    });
    try {
      const response = await fetch(`${server}/data`, {
        method: 'POST',
        body: formData,
      });
      const json = await response.json();
      setStatus(json?.status);
      setMessage(json?.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendFiles();
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click()
  }

  const uploadFiles = (e) => {
    const file = e.target.files[0]
    if (!file) return;
    const fileName = file.name.length > 12
      ? `${file.name.substring(0, 13)}... .${file.name.split('.')[1]}`
      : file.name;
    
    const formData = new FormData();
    formData.append('file', file)
    setFiles(prevState => [...prevState, {name: fileName, loading: 0}])
    setShowProgress(true)
    // now axios request here....
  }

  return (
    <div>
      <div id="sideBar">
        {/* <div style={BUTTON_WRAPPER_STYLES} onClick={() => console.log('clicked')}>
          <form onSubmit={handleSubmit}>
            <input type="file" id="myFiles" accept="image/*" multiple />
            <button type="submit">Submit</button>
          </form>
        </div> */}
        <button id="uploadBtn" onClick={() => setIsOpen(true)}>
            <img src={google} alt="upload img" />
            <p>Upload</p>
            <UploadModal open={isOpen} onClose={() => setIsOpen(false)} >
              <div className="upload-box">
                <p>Upload your file</p>
                <form>
                  <input 
                    type="file" 
                    className="file-input"
                    name="file"
                    hidden 
                    ref={fileInputRef}
                    onChange={uploadFiles}
                    multiple />
                  <FaFileUpload className="icon" onClickCapture={handleFileInputClick} />
                </form>
                
                <nav className="file-box">
                  { showProgress && (
                    <section className="loading-area">
                      {files.map((file, index) => (
                        <li className="row" key={index}>
                          <FaFileLines className="icon" />
                          <div className="content">
                            <div className="details">
                              <span className="name">
                                {`${file.name} - uploading`}
                              </span>
                              <div>
                                <span className="percent">
                                  {`${file.loading}%`}
                                </span>
                                <div className="loading-bar">
                                  <div className="loading" style={{width: `${file.loading}%`}}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </section>
                  )} 
                  <section className="uploaded-area">
                    {uploadedFiles.map((file, index) => (
                      <li className="row" key={index}>
                      <div className="content upload">
                        <FaFileLines className="icon" />
                        <div className="details">
                          <span className="name">{file.name}</span>
                          <span className="size">{file.size}</span>
                        </div>
                      </div>
                      <IoCheckmarkSharp className="icon" />
                      
                    </li>
                    ))}
                  </section>
                </nav>
              </div>
            </UploadModal>
        </button>
        
        <div id="sideBarOpt">
          <div className="sideBarOptions">
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

          <div className="sideBarOptions activeSideOpt">
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