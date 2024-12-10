/* eslint-disable react/jsx-indent, @typescript-eslint/indent */

'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar, NavDropdown, Image } from 'react-bootstrap';
import { BoxArrowRight, Lock, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import '../app/globals.css';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const currentUser = session?.user?.email;
  const pathName = usePathname();
  return (
    <Navbar className="custom-navbar" expand="lg">
      <Container>
        <div className="navbar-div">
        <Navbar.Brand href="/">
          <Image
            src="/Logo.PNG"
            width="70"
            height="70"
            className="logo d-inline-block align-top"
            alt="logo"
          />
        </Navbar.Brand>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto justify-content-center">
            <Nav.Link id="about-stuff-nav" href="/#about" key="about" active={pathName === '/about'}>
              About
            </Nav.Link>
            <Nav.Link id="tutorial-stuff-nav" href="/#tutorial" key="tutorial" active={pathName === '/tutorial'}>
              Tutorial
            </Nav.Link>
            {currentUser
              ? [
                  <Nav.Link id="sessions" href="/sessions" key="sessions" active={pathName === '/sessions'}>
                    Sessions
                  </Nav.Link>,
                  // eslint-disable-next-line max-len
                  <Nav.Link id="list-stuff-nav" href="/mySessions" key="mySessions" active={pathName === '/mySessions'}>
                    My Sessions
                  </Nav.Link>,
                  <Nav.Link id="buddies" href="/buddies" key="buddies" active={pathName === '/buddies'}>
                    Buddies
                  </Nav.Link>,
                  <Nav.Link id="myBuddies" href="/myBuddies" key="myBuddies" active={pathName === '/myBuddies'}>
                    My Buddies
                  </Nav.Link>,
                  <Nav.Link
                    id="studyPlaylist"
                    href="/studyPlaylist"
                    key="studyPlaylist"
                    active={pathName === '/studyPlaylist'}
                  >
                    Study Playlist
                  </Nav.Link>,
                ]
              : ''}
          </Nav>
          <div className="navbar-div">
          <Nav className="justify-content-end">
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/myProfile">
                  <PersonFill className="mx-2" />
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight className="mx-2" />
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock className="mx-2" />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown id="login-dropdown" title="Login">
                <NavDropdown.Item id="login-dropdown-sign-in" href="/auth/signin">
                  <PersonFill />
                  Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-sign-up" href="/auth/signup">
                  <PersonPlusFill />
                  Sign up
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
