import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { fetchGroup, createNewUser } from '../../services/userService';
import { toast } from 'react-toastify';
import _ from 'lodash';

const ModalUser = (props) => {
    const defaultUserData = {
        soDienThoai: '',
        hoTen: '',
        email: '',
        soDD: '',
        gioiTinh: '',
        ngaySinh: '',
        dcThuongTru: '',
        anhDD: '',
        nhomId: '',
        matKhau: ''
    }

    const validDefaultInputs = {
        soDienThoai: true,
        hoTen: true,
        email: true,
        soDD: true,
        gioiTinh: true,
        ngaySinh: true,
        dcThuongTru: true,
        anhDD: true,
        nhomId: true,
        matKhau: true
    }

    const [userData, setUserData] = useState(defaultUserData);
    const [validInputs, setValidInputs] = useState(validDefaultInputs);
    const [userGroups, setUserGroups] = useState([]);

    useEffect (() => {
        getGroups();
    }, []);

    const getGroups = async () => {
        let res = await fetchGroup();
        if (res && res.data && res.data.EC === 0) {
            setUserGroups(res.data.DT);
            if (res.data.DT && res.data.DT.length > 0) {
                let groups = res.data.DT;
                setUserData({...userData, nhomId: groups[0].id});
            }
        } else {
            toast.error(res.data.EM);
        }
    }

    const handleOnChangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        if (name === "anhDD" && value) {
            // Đọc ảnh bằng FileReader
            const reader = new FileReader();
            reader.onloadend = () => {
                _userData[name] = reader.result; // Lưu ảnh dưới dạng base64 URL vào state
                setUserData(_userData);
            };
            reader.readAsDataURL(value);
        } else {
            _userData[name] = value;
            setUserData(_userData);
        }
    }

    const checkValidInputs = () => {
        setValidInputs(validDefaultInputs);

        // let arr = ['soDienThoai', 'email', 'nhomId', 'matKhau'];
        // let check = true;
        // for (let i = 0; i < arr.length; i++) {
        //     if (!userData[arr[i]]) {
        //         let _validInputs = _.cloneDeep(validDefaultInputs);
        //         toast.error(`Trường ${arr[i] === 'soDienThoai' ? 'số điện thoại' : arr[i] === 'matKhau' ? 'mật khẩu' : arr[i] === 'nhomId' ? 'Nhóm người dùng' : arr[i]} không được trống.`);
        //         _validInputs[arr[i]] = false;
        //         setValidInputs(_validInputs);
        //         check = false;
        //         break;
        //     }
        // }

        let _validInputs = _.cloneDeep(validDefaultInputs);

        if (!userData.soDienThoai) {
            _validInputs.soDienThoai = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng nhập số điện thoại.");
            return false;
        }
        let regxMobile = /(0[3|5|7|8|9])+([0-9]{8})\b/g;
        if (!regxMobile.test(userData.soDienThoai)) {
            _validInputs.soDienThoai = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng nhập một số điện thoại hợp lệ!");
            return false;
        }

        if (!userData.email) {
            _validInputs.email = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng nhập email.");
            return false;
        }
        let regxEmail = /\S+@\S+\.\S+/;
        if (!regxEmail.test(userData.email)) {
            _validInputs.email = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng nhập một email hợp lệ!");
            return false;
        }

        if (!userData.nhomId) {
            _validInputs.nhomId = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng chọn nhóm người dùng.");
            return false;
        }

        if (!userData.matKhau) {
            _validInputs.matKhau = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng nhập mật khẩu.");
            return false;
        }
        if (userData.matKhau.length < 8) {
            _validInputs.matKhau = false;
            setValidInputs(_validInputs);
            toast.error("Mật khẩu phải có ít nhất 8 ký tự.");
            return false;
        }

        return true;
    }

    const handleConfirmUser = async () => {
        let check = checkValidInputs();
        if (check === true) {
            let res = await createNewUser(userData);
            if (res.data && res.data.EC === 0) {
                props.onHide();
                setUserData({...defaultUserData, nhomId: userGroups[0].id});
            } else {
                toast.error("Quá trình tạo người dùng đang gặp vấn đề...");
            }
        }
    }

    return (
        <>
            <Modal size="lg" show={props.show} onHide={props.onHide} className='modal-user'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>{props.title}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Số điện thoại (<span className='red'>*</span>):</label>
                            <input className={validInputs.soDienThoai ? 'form-control' : 'form-control is-invalid'}
                                type='text' value={userData.soDienThoai}
                                onChange={(event) => handleOnChangeInput(event.target.value, "soDienThoai")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Họ tên:</label>
                            <input className='form-control' type='text' value={userData.hoTen}
                                onChange={(event) => handleOnChangeInput(event.target.value, "hoTen")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Email (<span className='red'>*</span>):</label>
                            <input className={validInputs.email ? 'form-control' : 'form-control is-invalid'}
                                type='email' value={userData.email}
                                onChange={(event) => handleOnChangeInput(event.target.value, "email")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Số định danh cá nhân:</label>
                            <input className='form-control' type='text' value={userData.soDD}
                                onChange={(event) => handleOnChangeInput(event.target.value, "soDD")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Giới tính:</label>
                            <select className='form-select'
                                onChange={(event) => handleOnChangeInput(event.target.value, "gioiTinh")}
                            >
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Ngày sinh:</label>
                            <input className='form-control' type='date'
                                onChange={(event) => handleOnChangeInput(event.target.value, "ngaySinh")}
                            />
                        </div>
                        <div className='col-12 col-sm-12 form-group'>
                            <label>Địa chỉ thường trú:</label>
                            <input className='form-control' type='text' value={userData.dcThuongTru}
                                onChange={(event) => handleOnChangeInput(event.target.value, "dcThuongTru")}
                            />
                        </div>
                        <div className='col-12 col-sm-12 form-group'>
                            <label>Ảnh đại diện:</label>
                            <input className='form-control' type='file'
                                onChange={(event) => handleOnChangeInput(event.target.files[0], "anhDD")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Nhóm người dùng (<span className='red'>*</span>):</label>
                            <select className={validInputs.nhomId ? 'form-select' : 'form-select is-invalid'}
                                onChange={(event) => handleOnChangeInput(event.target.value, "nhomId")}
                            >
                                {userGroups.length > 0 &&
                                    userGroups.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.tenNhom}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Mật khẩu (<span className='red'>*</span>):</label>
                            <input className={validInputs.matKhau ? 'form-control' : 'form-control is-invalid'}
                                type='password' value={userData.matKhau}
                                onChange={(event) => handleOnChangeInput(event.target.value, "matKhau")}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                    Đóng
                    </Button>
                    <Button variant="primary" onClick={() => handleConfirmUser()}>
                    Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalUser;