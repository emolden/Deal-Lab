import React from 'react';
import styled from 'styled-components';
import { StyledMenu } from './Menu.styled';
import DefaultSettings from '../DefaultSettings/DefaultSettings';
import PropertyPage from '../PropertyPage/PropertyPage';
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import LogOutButton from '../App/LogOutButton/LogOutButton';


function Menu ({ open }) {
  return (
    <StyledMenu open={open}>

        {/* <>
            <Link className="navLink" to="/property-page">
              Properties
            </Link>

            <Link className="navLink" to="/default-settings">
              Default Settings
            </Link>

            <LogOutButton className="navLink" />

        </> */}

        <a href="/">
        <span aria-label="properties">&#x1f481;&#x1f3fb;&#x200d;&#x2642;&#xfe0f;</span>
        Properties
      </a>
      <a href="/">
        <span aria-label="default settings">&#x1f4b8;</span>
        Default Settings
        </a>

    </StyledMenu>
  )
}

// Menu.propTypes = {
//     open: bool.isRequired,
//   }

export default Menu;