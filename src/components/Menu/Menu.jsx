import styled from "styled-components";
import React from "react";
import { StyledMenu } from "./Menu.styled";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { StyledLogOutButton } from "../App/LogOutButton/LogOutButton.styled";

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.xButton}; /* Change this to the color you want */
  font-size: 2rem; /* Adjust size */
  position: absolute; /* Position it at the top right */
  top: 1rem;
  right: 1rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.primaryHover}; /* Change color on hover */
  }
`;

function Menu({ open, setOpen }) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user); // Get login state from Redux

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    handleLinkClick();
  };

  const defaultSettingsPage = "/default-settings/" + `${user.id}`;

  return (
    <StyledMenu open={open}>
        <CloseButton onClick={() => setOpen(false)}>X</CloseButton>
      {!user.id ? (
        <Link to="/login" onClick={handleLinkClick}>
          Login
      </Link>
      ) : (
        <>
          <Link to="/property-page" onClick={handleLinkClick}>
            Properties
          </Link>
          <Link to={defaultSettingsPage} onClick={handleLinkClick}>
            Default Settings
          </Link>
          <StyledLogOutButton onClick={handleLogout}>
            Logout
          </StyledLogOutButton>
        </>
      )}
    </StyledMenu>
  );
}

export default Menu;
