import React, { Fragment, useContext } from 'react'
import list_view from "../../assets/list_view.jpg";
import info from "../../assets/info.png";
import "../../css/DisplayContainer.css";
import DisplayCard from "../DisplayCard/DisplayCard.jsx";
import { Context } from '../../index.js';
import Loading from '../Loading.jsx';

const DisplayContainer = (props) => {

  const {setLoading, loading} = useContext(Context);
  const { folders, files, setFolderId } = props
  return (
    <>
      <div id="container">
        <div id="header__container">
          <p>Home</p>

          <button>
            <img src={list_view} alt="Reload page" className="opacity" />
          </button>

          <button>
            <img src={info} alt="Reload page" className="opacity" />
          </button>
        </div>

        { (loading)
          ? <Loading />
          : (
            <Fragment>
              {console.log(folders)}
              <div className="nav__container">
                {
                  (folders)
                  ? (
                    <>
                      <p>Folders</p>
                      {folders.map((folder) => {
                        return (
                          <DisplayCard 
                            type="folder" 
                            name={folder.name} 
                            id={folder._id}
                            setFolderId={setFolderId} />
                        )
                      })
                      }
                    </>
                  )
                  : (files)
                    ? (
                      <>
                        <p>Files</p>
                        
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                        <DisplayCard name="file" />
                      </>
                    ) 
                    : <p>Empty!!</p>
                }  
              </div>
            </Fragment>
          )}
      </div>
    </>
  )
}

export default DisplayContainer