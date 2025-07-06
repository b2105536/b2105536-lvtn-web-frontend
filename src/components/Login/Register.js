import React, { useEffect, useState } from "react";
import './Register.scss';
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { registerNewUser } from "../../services/userService";

const Register = (props) => {
    const [soDienThoai, setMobile] = useState("");
    const [hoTen, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [matKhau, setPassword] = useState("");
    const [xacNhanMatKhau, setConfirmPassword] = useState("");
    const defaultValidInput = {
        isValidMobile: true,
        isValidEmail: true,
        isValidPassword: true,
        isValidConfirmPassword: true
    };
    const [objCheckInput, setObjCheckInput] = useState(defaultValidInput);

    let history = useHistory();
    const handleLogin = () => {
        history.push("/login");
    }

    const isValidInputs = () => {
        setObjCheckInput(defaultValidInput);

        if (!soDienThoai) {
            toast.error("Vui lòng nhập số điện thoại.");
            setObjCheckInput({ ...defaultValidInput, isValidMobile: false });
            return false;
        }
        let regxMobile = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
        if (!regxMobile.test(soDienThoai)) {
            setObjCheckInput({ ...defaultValidInput, isValidMobile: false });
            toast.error("Vui lòng nhập một số điện thoại hợp lệ!");
            return false;
        }

        if (!email) {
            toast.error("Vui lòng nhập email.");
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            return false;
        }
        let regxEmail = /\S+@\S+\.\S+/;
        if (!regxEmail.test(email)) {
            setObjCheckInput({ ...defaultValidInput, isValidEmail: false });
            toast.error("Vui lòng nhập một email hợp lệ!");
            return false;
        }

        if (!matKhau) {
            toast.error("Vui lòng nhập mật khẩu.");
            setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
            return false;
        }
        if (matKhau.length < 8) {
            toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
            setObjCheckInput({ ...defaultValidInput, isValidPassword: false });
            return false;
        }
        if (matKhau !== xacNhanMatKhau) {
            setObjCheckInput({ ...defaultValidInput, isValidConfirmPassword: false });
            toast.error("Mật khẩu không khớp!");
            return false;
        }

        return true;
    }

    const handleRegister = async () => {
        let check = isValidInputs();
        if (check === true) {
            let response = await registerNewUser(soDienThoai, hoTen, email, matKhau);
            let serverData = response.data;
            if (+serverData.EC === 0) {
                toast.success(serverData.EM);
                history.push("/login");
            } else {
                toast.error(serverData.EM);
            }
        }
    }

    useEffect(() => {
        // axios.get("http://localhost:8080/api/v1/test-api").then(data => {
        //     console.log(data);
        // })
    }, []);

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
                            <input type="text" className={objCheckInput.isValidMobile ? 'form-control' : 'form-control is-invalid'} placeholder="Số điện thoại"
                                value={soDienThoai} onChange={(event) => setMobile(event.target.value)}
                            />
                        </div>               
                        <div className="form-group">
                            <label>Họ và tên:</label>
                            <input type="text" className="form-control" placeholder="Họ và tên"
                                value={hoTen} onChange={(event) => setFullname(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <input type="text" className={objCheckInput.isValidEmail ? 'form-control' : 'form-control is-invalid'} placeholder="Email"
                                value={email} onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu:</label>
                            <input type="password" className={objCheckInput.isValidPassword ? 'form-control' : 'form-control is-invalid'} placeholder="Mật khẩu"
                                value={matKhau} onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Nhập lại mật khẩu:</label>
                            <input type="password" className={objCheckInput.isValidConfirmPassword ? 'form-control' : 'form-control is-invalid'} placeholder="Nhập lại mật khẩu"
                                value={xacNhanMatKhau} onChange={(event) => setConfirmPassword(event.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary" type="button" onClick={() => handleRegister()}>Đăng ký</button>

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