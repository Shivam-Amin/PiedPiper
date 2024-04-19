import React from "react";
import { FaFolder } from "react-icons/fa";
import { FaFileLines } from "react-icons/fa6";
import { HiOutlineDotsVertical } from "react-icons/hi";
import "../../css/DisplayCard.css";

export default function DisplayCard(props) {

  const {type, name, id, setFolderId} = props;
  const handleDoubleClick = async () => {
    console.log(id);
    await setFolderId(id);
  }
  return (
    <div className="displayCard" id={id} onDoubleClick={handleDoubleClick}>
      {
        (type === "folder")
        ? <FaFolder className="svg" />
        : <FaFileLines className="svg" />
      }
      <p>{name} </p>
      <input type="checkbox" />
      <label> <HiOutlineDotsVertical className="svg"/> </label>
    </div>
  );
}
