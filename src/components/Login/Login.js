import React, { useEffect, useState } from "react";
import './Login.scss';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/userService";

const Login = (props) => {
    let history = useHistory();

    const [valueLogin, setValueLogin] = useState("");
    const [matKhau, setPassword] = useState("");
    const defaultValidInput = {
        isValidValueLogin: true,
        isValidPassword: true,
    };
    const [objValidInput, setObjValidInput] = useState(defaultValidInput);

    const handleCreateNewAccount = () => {
        history.push("/register");
    }

    const handleLogin = async () => {
        setObjValidInput(defaultValidInput);

        if (!valueLogin) {
            setObjValidInput({ ...defaultValidInput, isValidValueLogin: false });
            toast.error("Vui lòng nhập email hoặc số điện thoại.");
            return;
        }
        if (!matKhau) {
            setObjValidInput({ ...defaultValidInput, isValidPassword: false });
            toast.error("Vui lòng nhập mật khẩu.");
            return;
        }

        let response = await loginUser(valueLogin, matKhau);
        if (response && response.data && +response.data.EC === 0) {
            let data = {
                isAuthenticated: true,
                token: 'fake token'
            };
            sessionStorage.setItem('account', JSON.stringify(data));
            
            history.push("/users");
            window.location.reload();
        }
        if (response && response.data && +response.data.EC !== 0) {
            toast.error(response.data.EM);
        }
    }

    const handlePressEnter = (event) => {
        if (event.charCode === 13 && event.code === 'Enter') {
            handleLogin();
        }
    }

    useEffect (() => {
        let session = sessionStorage.getItem('account');
        if (session) {
            history.push("/");
            window.location.reload();
        }
    }, []);
    
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
                        <input
                            type="text"
                            className={objValidInput.isValidValueLogin ? 'form-control' : 'form-control is-invalid'}
                            placeholder="Email hoặc số điện thoại"
                            value={valueLogin}
                            onChange={(event) => setValueLogin(event.target.value)}
                        />
                        <input
                            type="password"
                            className={objValidInput.isValidPassword ? 'form-control' : 'form-control is-invalid'}
                            placeholder="Mật khẩu"
                            value={matKhau}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyPress={(event) => handlePressEnter(event)}
                        />
                        <button className="btn btn-primary" onClick={() => handleLogin()}>Đăng nhập</button>
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