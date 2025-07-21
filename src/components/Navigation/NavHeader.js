import React, { useContext } from "react";
import './Nav.scss';
import { Link, NavLink, useLocation, useHistory } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from '../../logo.png';
import { logoutUser } from '../../services/userService';
import { toast } from "react-toastify";

const NavHeader = (props) => {
    const { user, logoutContext } = useContext(UserContext);
    const location = useLocation();
    const history = useHistory();

    const handleLogout = async () => {
        let data = await logoutUser(); // clear cookies
        localStorage.removeItem('jwt'); // clear local storage
        logoutContext(); // clear user in context

        if (data && +data.EC === 0) {
            toast.success("Đăng xuất thành công!");
            history.push('/login');
        } else {
            toast.error(data.EM);
        }
    }

    if (user && user.isAuthenticated === true || location.pathname === '/' || location.pathname === '/about') {
        const userRoleId = user?.account?.quyenCuaNhom?.id;

        const renderNavLinks = () => {
            switch (userRoleId) {
                case 1: // Admin
                    return (
                        <>
                            <NavLink to="/dashboards" exact className="nav-link">TỔNG QUAN</NavLink>
                            <NavLink to="/users" className="nav-link">NGƯỜI DÙNG</NavLink>
                            <NavLink to="/houses" className="nav-link">NHÀ</NavLink>
                            <NavLink to="/rooms" className="nav-link">PHÒNG</NavLink>
                            <NavLink to="/manage/service" className="nav-link">DỊCH VỤ</NavLink>
                            <NavLink to="/roles" className="nav-link">QUYỀN</NavLink>
                            <NavLink to="/group-role" className="nav-link">PHÂN QUYỀN</NavLink>
                        </>
                    );
                case 2: // Chủ trọ
                    return (
                        <>
                            <NavLink to="/" className="nav-link">TRANG CHỦ</NavLink>
                            <NavLink to="/manage/student" className="nav-link">QUẢN LÝ CHUNG</NavLink>
                            <NavLink to="/about" className="nav-link">GIỚI THIỆU</NavLink>
                        </>
                    );
                case 3: // Sinh viên
                    return (
                        <>
                            <NavLink to="/" className="nav-link">TRANG CHỦ</NavLink>
                            <NavLink to="/about" className="nav-link">GIỚI THIỆU</NavLink>
                        </>
                    );
                default: // Khách hàng
                    return (
                        <>
                            <NavLink to="/" className="nav-link">TRANG CHỦ</NavLink>
                            <NavLink to="/about" className="nav-link">GIỚI THIỆU</NavLink>
                        </>
                    );
            }
        };
        
        return (
        <>
            <div className="nav-header">
                <Navbar bg="header" expand="lg">
                    <Container>
                        <Navbar.Brand>
                            <img
                                src={logo}
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                                alt="C-Housing logo"
                            />
                            <span className="brand-name">C-Housing</span>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                {renderNavLinks()}
                            </Nav>
                            <Nav>
                                {user && user.isAuthenticated === true ?
                                <>
                                    <Nav.Item className="nav-link">
                                        Xin chào {user.account.hoTen}!
                                    </Nav.Item>
                                    <NavDropdown title="Cài đặt" id="basic-nav-dropdown">
                                        <NavDropdown.Item>Đổi mật khẩu</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item>
                                            <span onClick={() => handleLogout()}>Đăng xuất</span>
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                                :
                                    <Link className="nav-link" to="/login">
                                        Đăng nhập
                                    </Link>
                                }
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