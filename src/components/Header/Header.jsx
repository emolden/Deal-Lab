import LogOutButton from "../App/LogOutButton/LogOutButton";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector } from "react-redux";
import { useState, useRef } from "react";
import { useOnClickOutside } from "../../hooks/hooks";

import React from "react";
import "./Header.css";
import Hamburger from "../Hamburger/Hamburger";
import Menu from "../Menu/Menu";

function Header() {
  const user = useSelector((store) => store.user);
  const [open, setOpen] = useState(false);
  const node = useRef();
  useOnClickOutside(node, () => setOpen(false));

  return (
    <div>
      <div>
        <header className="header">
          <container className="container">
            <img className="logo" src="./deal-lab-logo.png" />
            <h2 className="fix-flip">Fix & Flipper</h2>
          </container>

          <div ref={node}>
            <Hamburger open={open} setOpen={setOpen} />
            <Menu open={open} setOpen={setOpen} />
          </div>
        </header>
      </div>
    </div>
  );
}

export default Header;
