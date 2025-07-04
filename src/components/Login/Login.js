import React from "react";
import './Login.scss';
import { useHistory } from "react-router-dom";

const Login = (props) => {
    let history = useHistory();
    const handleCreateNewAccount = () => {
        history.push("/register");
    }

    return (
        <div className="login-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="left-content col-12 col-sm-7 d-none d-sm-block">
                        <div className="brand">C-Housing</div>
                        <div className="detail">Hệ thống quản lý nhà trọ sinh viên.</div>
                    </div>
                    <div className="right-content col-12 col-sm-5 d-flex flex-column gap-3 py-3">
                        <div className="brand d-sm-none">C-Housing</div>
                        <input type="text" className="form-control" placeholder="Email hoặc số điện thoại"/>
                        <input type="password" className="form-control" placeholder="Mật khẩu"/>
                        <button className="btn btn-primary">Đăng nhập</button>
                        <span className="text-center">
                            <a href="#" className="forgot-password">Quên mật khẩu?</a>
                        </span>
                        <hr />
                        <div className="text-center">
                            <button className="btn btn-success" onClick={() => handleCreateNewAccount()}>
                                Tạo tài khoản mới
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;