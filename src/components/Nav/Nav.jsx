import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../App/LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import Hamburger from '../Hamburger/Hamburger';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/home">
        {/* <h2 className="nav-title">Deal Lab: Fix & Flipper</h2> */}
        <img 
        className="logo"
        src="./deal-lab-logo.png" />
        <h2 className="fix-flip">Fix & Flipper</h2>

      </Link>
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

            <div className="hamburger">
            <Hamburger />
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default Nav;
