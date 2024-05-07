import React from "react";
import { Navbar } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar variant="dark" style={{ backgroundColor: "#ff6666" }}>
      <Navbar.Brand className="fs-4 fw-bold">React Test App</Navbar.Brand>
    </Navbar>
  );
};

export default Header;
