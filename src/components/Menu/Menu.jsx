import React from 'react';
import styled from 'styled-components';
import { StyledMenu } from './Menu.styled';
import DefaultSettings from '../DefaultSettings/DefaultSettings';
import PropertyPage from '../PropertyPage/PropertyPage';
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import LogOutButton from '../App/LogOutButton/LogOutButton';


function Menu ({ open, setOpen }) {
    const handleLinkClick = () => {
        setOpen(false);
    }

  return (
    <StyledMenu open={open}>

      <a>
        <Link to="/property-page" onClick={handleLinkClick}>
              Properties
            </Link>
      </a>
      <a>
        <Link to="/default-settings" onClick={handleLinkClick}>
              Default Settings
            </Link>
        </a>
     <a>
        <Link to="/" onClick={handleLinkClick}>
        <LogOutButton className="navLink" />
        </Link>
        </a>

    </StyledMenu>
  )
}

// Menu.propTypes = {
//     open: bool.isRequired,
//   }

export default Menu;