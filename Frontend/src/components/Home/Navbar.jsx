import React from "react";
import icon from "../../assets/logo.jpg";
import search from "../../assets/search.png";
import filters from "../../assets/filters.png";
import interrogation from "../../assets/interrogation.png"
import settings from "../../assets/settings.png"
import list from "../../assets/list.png";
import "../../css/Navbar.css";


const Navbar = (props) => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <a href='/'>
              <div id="icon">
                <img src={icon} alt="Reload page" />
              </div>
            </a>
          </li>

          <li>
            <div id="searchBar">
              <button>
                <img src={search} alt="Reload page" className="opacity" />
              </button>
              <input type="text" placeholder="Search" />
              <button>
                <img src={filters} alt="Reload page" className="opacity" />
              </button>
            </div>
          </li>

          <li>
            <div id="navOptions">
                <button><img src={interrogation} alt='Reload page' className="opacity"/></button>
                <button><img src={settings} alt='Reload page' className="opacity"/></button>
                <button><img src={list} alt='Reload page' className="opacity"/></button>
                <button><img src={filters} alt='Reload page' className="opacity"/></button>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar