import React, { useContext, useEffect, useRef, useState } from 'react';
import '../../css/ContextMenu.css'
import { HomeContext } from './Home';
import { Context } from '../..';

const ContextMenu = ({ x, y, visible, onItemClick }) => {
  const {setHomeLoading} = useContext(Context)
  const {contextMenuItems, rightClickOnFolder, setRightClickOnFolder,
    cmWidth, cmHeight, isFolder } = useContext(HomeContext)

  if (!visible) {
    return null;
  }

  const style = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    width: `${cmWidth}px`,
    height: `${cmHeight}px`,
    padding: '2px',
    backgroundColor: 'white',
    // border: '1px solid purple',
    borderRadius: '4px',
    // boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
    boxShadow: '0 0 9px 2px rgba(0, 0, 0, 0.1)',
    zIndex: 2,
  };

  return (
    <div 
      style={style} 
      className="context-menu" >
      {contextMenuItems.map((item, index) => {
        const { img, title } = item; // Assuming 'img' and 'title' are properties of 'item'

        // check for clicked on folder or not..
        // if not on folder then don't show last delete option
        let shouldDisplay = rightClickOnFolder || 
          (!rightClickOnFolder && index !== contextMenuItems?.length - 1
            && index !== 0 && index !== 1);
        
        if (!shouldDisplay) {
          return null; // Do not render anything if the condition is false
        }

        
        if (rightClickOnFolder) {
          if (index == 2 || index == 3)
            return null;
        }

        return (
          <div
            key={index}
            onClick={() => {
              // setHomeLoading(true)
              onItemClick(item.title)
            }}
            style={{ padding: '10px', cursor: 'pointer' }} >

            <span className="svg">{img}</span>
            <span className="title">{title}</span>

          </div>
        )})}
    </div>
  );
};

export default ContextMenu;