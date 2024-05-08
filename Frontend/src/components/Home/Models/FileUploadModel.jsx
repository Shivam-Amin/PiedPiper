import { FaFileUpload } from "react-icons/fa"
import UploadModel from "./UploadModel"
import { FaFileLines } from "react-icons/fa6"
import { IoCheckmarkSharp } from "react-icons/io5"
import { useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
import { Context, server } from "../../.."
import toast from "react-hot-toast"
import { HomeContext } from "../Home"

export const FileUploadModel = ({ loading, setLoading, setFileUploadOption, fileUploadOption }) => {
  const [isOpen, setIsOpen] = useState(true)
  const { folderId } = useContext(HomeContext);
  const {homeLoading, setHomeLoading} = useContext(Context)
  // const [files, setFiles] = useState([{name:'file1', size:'15MB', loading:'20'}])

  const [files, setFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([{name:'file2', size:'10MB', loading:'34'}])
  const [showProgress, setShowProgress] = useState(true)

  const fileInputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false);


  useEffect(() => {
    const asyncFunction = async () => {
      
      const f = await sessionStorage.getItem('files')
      const uf = await sessionStorage.getItem('uploadedFiles')
      if (f) {
        await setFiles(JSON.parse(f))
      }
      if (uf) {
        await setUploadedFiles(JSON.parse(uf))
      }
    } 
    asyncFunction();
  },[])

  useEffect(() => {
    const asyncFunction = async () => {
      await sessionStorage.setItem('files', JSON.stringify(files))
      await sessionStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles))
    } 
    asyncFunction();
  },[files, uploadedFiles])

  const handleFileInputClick = () => {
    fileInputRef.current.click()
  }

  const handleDragEnter = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true); // Indicate that something is over the drop zone
  };

  const handleDragLeave = (event) => {
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      // Handle the file(s) that were dropped
      console.log("Dropped files:", files);
      // fileInputRef.current.files = files

      // Simulate the "change" event for the file input
      const dataTransfer = new DataTransfer();
      for (let i = 0; i < files.length; i++) {
        dataTransfer.items.add(files[i]);
      }
      fileInputRef.current.files = dataTransfer.files;
      showFiles();
      // Call the upload function or whatever you need to do
      // uploadFiles();
      console.log('dropped');
    }
  };

  const showFiles = async () => {
    if (!fileInputRef.current || fileInputRef.current.files.length === 0) {
      console.log('no files selected..');
      return;
    }
    setFiles([])
    const files = fileInputRef.current.files
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      if (!file) {
        continue; // In case there's no file, skip the iteration
      }
  
      const fileName = file.name.length > 12
        ? `${file.name.substring(0, 12)}...${file.name.split('.').pop()}`
        : file.name;
  
      const formData = new FormData();
      formData.append('file', file); // Add the file to FormData
  
      // Update the state or UI
      await setFiles((prevState) => [...prevState, { name: fileName, loading: 0 }]);
      setShowProgress(true);
  
      // TODO: Implement your Axios request here
      // axios.post('/upload', formData)...
      // fileInputRef.current.value = '';
    } 
  }

  const uploadFiles = async () => {

    if (!fileInputRef.current || fileInputRef.current.files.length === 0) {
      toast.error("No files selected!")
      return;
    }

    const files = [...fileInputRef.current.files];
    // console.log(files);
    // fileInputRef.current.value = '';
    // console.log('now null: ',fileInputRef.current.files);
    // console.log(typeof(files));
    
    
    for (let i = 0; i < files.length; i++) {
      const file = files[0];
  
      if (!file) {
        continue; // In case there's no file, skip the iteration
      }

      await EncodeFile(i, file);
    }
    await setHomeLoading(true)
    setTimeout(async () => {
      await setHomeLoading(false)
    }, 2000);
  }

  const sendFiles = async () => {
    const myFiles = document.getElementById('myFiles').files;
    console.log(myFiles);
    // const formData = new FormData();
    // Object.keys(myFiles).forEach((key) => {
    //   formData.append(myFiles.item(key).name, myFiles.item(key));
    // });
    // try 
  };

  const EncodeFile = (index, file) => {
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onloadend = () => {
    //   const newEncodedFile = reader.result;
      // setEncodedFile(newEncodedFile);
      uploadFile(index, file);
    // } 
  }

  const uploadFile = async (index, encodedFile) => {

    try { 
      // setHomeLoading(true)
      const myForm = new FormData();
      myForm.append("file", encodedFile);
      myForm.append("parentId", folderId);
      // console.log('uploooaaadddd::',file);

      const { data } = await axios.post(
        `${server}/data/file/upload`, 
        myForm
        , {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Specify the correct content type
        },
          onUploadProgress: (progressEvent) => {
            const percentage = Math.round((100*progressEvent.loaded)/progressEvent.total);
            // setUploadProgress(percentage);
            const tempFunc = async () => {
              if (percentage < 100) {
                setFiles((prevFileList) =>
                  prevFileList.map((file, i) =>
                    i === index
                      ? { ...file, loading: percentage }
                      : file
                  )
                );
              } else {
                setFiles((prevFileList) =>
                  prevFileList.map((file, i) =>
                    i === index
                      ? { ...file, loading: percentage }
                      : file
                  )
                );
                setHomeLoading(true);
                let addFile = files.at(index)
                console.log('addfile: ',addFile);
                console.log(files);
                const f = files.filter((file, i) => file.loading < 100)
                setFiles(f);
                console.log('f',f);
                setUploadedFiles([...uploadedFiles, addFile])
                console.log('ufile: ',uploadedFiles);
                setHomeLoading(false);
              }
            }
            tempFunc();
          }
          })

      // console.log(data.message);
      toast.success(data.message);
    } catch (error) {
      // console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // setHomeLoading(true);
    console.log('submitted');
    uploadFiles();
  };


  return (
    <UploadModel
      open={isOpen} 
      onClose={() => {
        setIsOpen(false);
        setFileUploadOption(false);
      }} 
      width={500} 
      height={540} >
      <div className="upload-box">
        <p>Upload your file</p>
        <form 
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onSubmit={handleSubmit} >
          <div className={`drag-drop-form ${dragOver ? 'drag-over' : ''}`} >
            <input 
              type="file" 
              className="file-input"
              name="file"
              hidden 
              onChange={showFiles}
              // onChangeCapture={showFiles}
              ref={fileInputRef}
              multiple />
            <FaFileUpload className="icon" onClickCapture={handleFileInputClick} />
          </div>

            <button type="submit">Upload</button>
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
    </UploadModel>
  )
}