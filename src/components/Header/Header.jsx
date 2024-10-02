import LogOutButton from "../App/LogOutButton/LogOutButton";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import React from "react";
import "./Header.css";
import Hamburger from "../Hamburger/Hamburger";

function Header() {
    const user = useSelector((store) => store.user);
  
  
    return (
      <div>
        <div>
          <header className="header">
          <container className="container">
          {/* <Link to="/home"> */}
        <img 
        className="logo"
        src="./deal-lab-logo.png" />
        {/* </Link> */}
        <h2 className="fix-flip">Fix & Flipper</h2>
        </container>
        
            
        <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className="navLink" to="/property-page">
              Properties
            </Link>

            <Link className="navLink" to="/default-settings">
              Default Settings
            </Link>

            <LogOutButton className="navLink" />

            {/* <div className="hamburger"> */}
            {/* <Hamburger /> */}
            {/* </div> */}
          </>
        )}

      </div>
          </header>
        </div>
      </div>
    );
  }
  
  export default Header;