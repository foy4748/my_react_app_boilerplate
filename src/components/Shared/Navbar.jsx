//import styles from "./Navbar.module.css";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useRef, useContext } from "react";

import {
  Container,
  Nav,
  Navbar,
  OverlayTrigger,
  Tooltip,
  Image,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-regular-svg-icons";

import { userContext } from "../../Contexts/AuthContext";

import { getAuth } from "firebase/auth";
import firebaseApp from "../../firebase.config.js";

const auth = getAuth(firebaseApp);

export default function NavBar({ darkActive, setDarkActive }) {
  // Executing Hooks
  const { setActiveUser, logOutHandler, authLoading } = useContext(userContext);
  const location = useLocation();

  const activeUser = auth.currentUser;
  //--------------------------------------

  // Event Handlers
  const toggleButton = useRef();
  const closeMenu = () => {
    if (toggleButton.current.nextSibling.classList.contains("show"))
      toggleButton.current.click();
  };

  const handleLogOut = () => {
    logOutHandler().then(() => {
      window.localStorage.clear("authtoken");
      setActiveUser(null);
    });
  };
  //--------------------------------------

  // Auth related JSX for conditional rendering
  const logoutNavItem = () => {
    return (
      <>
        <Nav.Link onClick={handleLogOut}>
          {" "}
          {activeUser?.email || "Log Out"}
        </Nav.Link>

        <OverlayTrigger
          placement={"bottom"}
          overlay={<Tooltip>{activeUser.displayName}</Tooltip>}
        >
          <Nav.Link onClick={handleLogOut}>
            {" "}
            {activeUser?.photoURL && (
              <Image
                className="userIcon"
                src={activeUser.photoURL}
                alt={activeUser.displayName}
                referrerPolicy="no-referrer"
              />
            )}
          </Nav.Link>
        </OverlayTrigger>
      </>
    );
  };

  const loginRegisterNavItem = () => {
    return (
      <>
        <Nav.Link
          as={NavLink}
          onClick={closeMenu}
          to="/register"
          state={{ from: location?.state?.from }}
          replace
        >
          Register
        </Nav.Link>
        <Nav.Link
          as={NavLink}
          onClick={closeMenu}
          to="/login"
          state={{ from: location?.state?.from }}
          replace
        >
          Login
        </Nav.Link>
      </>
    );
  };
  //-------------------------

  // Light & Dark Theme Switch JSX
  const light = (
    <OverlayTrigger
      placement={"bottom"}
      overlay={<Tooltip>Light Theme</Tooltip>}
    >
      <Nav.Item onClick={() => setDarkActive((curr) => !curr)}>
        {" "}
        <Nav.Link>
          {" "}
          <FontAwesomeIcon icon={faSun} />{" "}
        </Nav.Link>{" "}
      </Nav.Item>
    </OverlayTrigger>
  );
  const dark = (
    <OverlayTrigger
      placement={"bottom"}
      overlay={<Tooltip>Dark Theme</Tooltip>}
    >
      <Nav.Item onClick={() => setDarkActive((curr) => !curr)}>
        {" "}
        <Nav.Link>
          {" "}
          <FontAwesomeIcon icon={faMoon} />{" "}
        </Nav.Link>{" "}
      </Nav.Item>
    </OverlayTrigger>
  );
  //-------------------------------

  return (
    <>
      <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              className="brandLogo"
              src="https://seeklogo.com/images/P/preact-logo-64E4BF9ABC-seeklogo.com.png"
              alt="Reactify brand"
            />
          </Navbar.Brand>
          <Navbar.Brand as={Link} to="/">
            Reactify
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="responsive-navbar-nav"
            ref={toggleButton}
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} onClick={closeMenu} to="/test">
                Test
              </Nav.Link>
            </Nav>
            <Nav>
              {darkActive ? dark : light}
              {activeUser && activeUser?.uid ? (
                logoutNavItem()
              ) : authLoading ? (
                <>
                  {loginRegisterNavItem()}
                  <Nav.Link as={NavLink} to="/login">
                    {" "}
                    Loading..{" "}
                  </Nav.Link>
                </>
              ) : (
                loginRegisterNavItem()
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
