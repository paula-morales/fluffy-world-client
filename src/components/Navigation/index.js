import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectToken, selectUser } from "../../store/user/selectors";
import NavbarItem from "./NavbarItem";
import LoggedIn from "./LoggedIn";
import LoggedOut from "./LoggedOut";

export default function Navigation() {
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const loginLogoutControls = token ? <LoggedIn /> : <LoggedOut />;

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="justify-content-between"
      style={{
        maxWidth: "72rem",
        margin: "0 auto",
        height: "80px",
      }}
    >
      <Navbar.Brand as={NavLink} to="/">
        <img
          alt="FluffyWorld"
          src="https://image.flaticon.com/icons/png/512/21/21577.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        FLUFFY WORLD
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" style={{ flexGrow: 0 }}>
        <Nav>
          {!token ? <NavbarItem path="/signup" linkText="Sign up" /> : null}
          {user.isOwner ? (
            <NavbarItem path="/registerpet" linkText="Register your pet" />
          ) : null}
          {user.isCandidate ? (
            <NavbarItem
              path="/registerservice"
              linkText="Register your service"
            />
          ) : null}
          {loginLogoutControls}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
