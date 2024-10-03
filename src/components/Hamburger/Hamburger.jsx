import React from 'react';
import { StyledBurger } from './Hamburger.styled';
import { useState } from 'react';

function Hamburger({ setOpen, open }) {

    const hamburgerClick = () => {
        setOpen(!open);
    }

  return (
  
    <nav>
    <StyledBurger onClick={hamburgerClick}>
      <div />
      <div />
      <div />
    </StyledBurger>
    </nav>
  )
}

export default Hamburger;