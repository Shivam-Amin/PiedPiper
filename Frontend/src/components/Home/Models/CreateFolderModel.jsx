import { useContext, useState } from "react";
import InputControl from "../../InputControl/InputControl";
import UploadModel from "./UploadModel";
import { HomeContext } from "../Home";
import { Context } from "../../..";

export const CreateFolderModel = ({loading, setLoading, setCreateFolderOption, createFolder}) => {
  const {homeLoading, setHomeLoading} = useContext(Context)
  const {renameFolderOption} = useContext(HomeContext)
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setErrorMsg("Enter folder name")
      return;
    }
    setHomeLoading(true);
    setCreateFolderOption(false);
    createFolder(name);
  }
  
  return (

    <UploadModel open={isOpen} width={500} height={200} onClose={() => {
      setIsOpen(false) 
      setCreateFolderOption(false) 
    }} >

      <form className='form' onSubmit={(e) => handleSubmit(e)}>
        <InputControl type="text" 
          placeholder="Enter folder name"
          onChange={(e) => setName(e.target.value)} 
          autoFocus />
        <b className='errMsg'>{errorMsg}</b>
        <button disabled={loading} type='Submit'>
          {(renameFolderOption) ? 'Rename' : 'Create'}
        </button>
      </form>
    </UploadModel>
  )
}