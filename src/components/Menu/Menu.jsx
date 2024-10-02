import React from "react";
import styled from "styled-components";
import { StyledMenu } from "./Menu.styled";
import DefaultSettings from "../DefaultSettings/DefaultSettings";
import PropertyPage from "../PropertyPage/PropertyPage";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { StyledLogOutButton } from "../App/LogOutButton/LogOutButton.styled";

// const StyledLogOutButton = styled(LogOutButton)`
//   display: block; // Ensure it's block level like the links
//   font-size: 2rem;
//   text-transform: uppercase;
//   padding: 2rem 0;
//   color: ${({ theme }) => theme.primaryDark};
//   text-decoration: none;
// `;

function Menu({ open, setOpen }) {
  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <StyledMenu open={open}>
      <Link to="/property-page" onClick={handleLinkClick}>
        Properties
      </Link>
      <Link to="/default-settings" onClick={handleLinkClick}>
        Default Settings
      </Link>
      <StyledLogOutButton
        onClick={() => {
          // Handle logout logic here
          handleLinkClick();
        }}
      >
        Logout
      </StyledLogOutButton>
    </StyledMenu>
  );
}

// Menu.propTypes = {
//     open: bool.isRequired,
//   }

export default Menu;
