import React from "react";
import './Register.scss';
import { useHistory } from "react-router-dom";

const Register = (props) => {
    let history = useHistory();
    const handleLogin = () => {
        history.push("/login");
    }

    return (
        <div className="register-container">
            <div className="container">
                <div className="row px-3 px-sm-0">
                    <div className="left-content col-12 col-sm-7 d-none d-sm-block">
                        <div className="brand">C-Housing</div>
                        <div className="detail">Hệ thống quản lý nhà trọ sinh viên.</div>
                    </div>
                    <div className="right-content col-12 col-sm-5 d-flex flex-column gap-3 py-3">
                        <div className="brand d-sm-none">C-Housing</div>
                        <div className="form-group">
                            <label>Số điện thoại:</label>
                            <input type="text" className="form-control" placeholder="Số điện thoại"/>
                        </div>               
                        <div className="form-group">
                            <label>Họ và tên:</label>
                            <input type="text" className="form-control" placeholder="Họ và tên"/>
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="text" className="form-control" placeholder="Email"/>
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu:</label>
                            <input type="password" className="form-control" placeholder="Mật khẩu"/>
                        </div>
                        <div className="form-group">
                            <label>Nhập lại mật khẩu:</label>
                            <input type="password" className="form-control" placeholder="Nhập lại mật khẩu"/>
                        </div>

                        <button className="btn btn-primary">Đăng ký</button>

                        <hr />
                        <div className="text-center">
                            <button className="btn btn-success" onClick={() => handleLogin()}>
                                Bạn đã có tài khoản ư? Hãy đăng nhập.
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;