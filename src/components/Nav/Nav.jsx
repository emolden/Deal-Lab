import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../App/LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import Hamburger from '../Hamburger/Hamburger';

function Nav() {
  const user = useSelector((store) => store.user);

  const defaultSettingsLink = "/default-settings/" + `${user.id}`

  return (
    <div className="nav">
      <Link to="/home">
        {/* <h2 className="nav-title">Deal Lab: Fix & Flipper</h2> */}
        <img 
        className="logo"
        src="./deal-lab-logo.png" />
        <h2 className="fix-flip">Fix & Flipper</h2>

      </Link>
      <div className="navMenuDiv">

        {!user.id && (
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {user.id && (
          <div className="navMenu">
            <Link className="navLink" to="/property-page">
              Properties
            </Link>

            <Link className="navLink" to={defaultSettingsLink}>
              Default Settings
            </Link>

            <LogOutButton className="navLink" />

            <div className="hamburger">
              <Hamburger />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Nav;
