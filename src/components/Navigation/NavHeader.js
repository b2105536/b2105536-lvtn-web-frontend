import React, { useContext } from "react";
import './Nav.scss';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../logo.png';

const NavHeader = (props) => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    if (user && user.isAuthenticated === true || location.pathname === '/') {
        return (
        <>
            <div className="nav-header">
                <Navbar bg="header" expand="lg">
                    <Container>
                        <Navbar.Brand href="#home">
                            <img
                                src={logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                                alt="C-Housing logo"
                            />
                            <span className="brand-name"></span>C-Housing
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <NavLink to="/" exact className="nav-link">Home</NavLink>
                                <NavLink to="/users" className="nav-link">Users</NavLink>
                                <NavLink to="/houses" className="nav-link">Houses</NavLink>
                                <NavLink to="/about" className="nav-link">About</NavLink>
                            </Nav>
                            <Nav>
                                <Nav.Item className="nav-link">
                                    Xin chào ...!
                                </Nav.Item>
                                <NavDropdown title="Cài đặt" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/3.1">Đổi mật khẩu</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="#action/3.2">Đăng xuất</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </>
        );
    } else {
        return <></>
    }
}

export default NavHeader;