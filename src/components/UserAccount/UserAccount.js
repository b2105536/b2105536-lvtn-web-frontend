import './UserAccount.scss';
import { useContext, useState, useEffect } from "react";
import { Button, Col, Form, Image, Row } from "react-bootstrap";
import avatar from '../../default_avatar.png';
import { UserContext } from "../../context/UserContext";
import { fetchUserAccountInfo, updateUserAccountInfo } from "../../services/userService";
import { toast } from "react-toastify";

const UserAccount = (props) => {
    const { user } = useContext(UserContext);

    const [userInfo, setUserInfo] = useState(null);
    const [form, setForm] = useState({
        soDienThoai: "",
        hoTen: "",
        email: "",
        soDD: "",
        gioiTinh: "",
        ngaySinh: "",
        dcThuongTru: ""
    });
    const [fullnameEmpty, setFullnameEmpty] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [hover, setHover] = useState(false);

    useEffect (() => {
        getUserAccountInfo();
    }, []);

    const getUserAccountInfo = async () => {
        let res = await fetchUserAccountInfo(user.account.email);
        if (res && res.EC === 0) {
            let data = res.DT;
            setUserInfo(data);
            setForm({
                soDienThoai: data.soDienThoai || "",
                hoTen: data.hoTen || "",
                email: data.email || "",
                soDD: data.soDD || "",
                gioiTinh: data.gioiTinh === true || data.gioiTinh === "true" || data.gioiTinh === 1,
                ngaySinh: data.ngaySinh || "",
                dcThuongTru: data.dcThuongTru || ""
            });
        } else {
            toast.error(res.EM);
        }
    }

    const handleOnChange = (e) => {
        const { name, value, type } = e.target;
        let newValue = value;

        if (name === "gioiTinh" && type === "radio") {
            newValue = value === "true" || value === "1";
        }

        setForm({ ...form, [name]: newValue });
    }

    const handleImageChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleUpdate = async () => {
        if (!form.hoTen || form.hoTen.trim() === "") {
            setFullnameEmpty(true);
            toast.error("Họ tên không được để trống");
            return;
        } else {
            setFullnameEmpty(false);
        }

        let payload = {
            ...form,
            anhDD: previewImage || userInfo.anhDD
        };

        let res = await updateUserAccountInfo(payload);
        if (res && res.EC === 0) {
            toast.success(res.EM);
            await getUserAccountInfo();
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <div className="container">
            <div className="account-container mt-3">
                <div className="account-header">
                    <div className="title mb-3">
                        <h3>Tài khoản</h3>
                    </div>
                    <Row className="account-info align-items-center mb-3">
                        <Col md={2}>
                            <div className="avatar-wrapper"
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                            >
                                <Image
                                    src={previewImage || userInfo?.anhDD || avatar}
                                    roundedCircle
                                    width={100}
                                    height={100}
                                    className="avatar-img"
                                />
                                <div className="overlay-camera">
                                    <label htmlFor="avatar-upload" className="camera-label">
                                        <i className="fa fa-camera"></i>
                                    </label>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={(e) => handleImageChange(e)}
                                    />
                                </div>
                            </div>
                        </Col>
                        <Col>
                            <div className="fw-bold fs-5">{userInfo?.hoTen}</div>
                            <div className="text-muted">
                                {userInfo?.email} | {userInfo?.soDienThoai}
                            </div>
                        </Col>
                    </Row>
                    <hr />
                </div>
                <div className="account-body">
                    <h5 className="mb-3">Thông tin cá nhân</h5>
                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group >
                                    <Form.Label><span className='red me-1'>*</span>Họ tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="hoTen"
                                        value={form.hoTen}
                                        isInvalid={fullnameEmpty}
                                        onChange={(e) => handleOnChange(e)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Giới tính</Form.Label>
                                    <div>
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Nam"
                                            name="gioiTinh"
                                            value="true"
                                            checked={form.gioiTinh === true}
                                            onChange={(e) => handleOnChange(e)}
                                        />
                                        <Form.Check
                                            inline
                                            type="radio"
                                            label="Nữ"
                                            name="gioiTinh"
                                            value="false"
                                            checked={form.gioiTinh === false}
                                            onChange={(e) => handleOnChange(e)}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label><span className='red me-1'>*</span>Số điện thoại</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="soDienThoai"
                                        value={form.soDienThoai}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label><span className='red me-1'>*</span>Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="email"
                                        value={form.email}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Số định danh</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="soDD"
                                        value={form.soDD}
                                        onChange={(e) => handleOnChange(e)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Ngày sinh</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="ngaySinh"
                                        value={form.ngaySinh}
                                        onChange={(e) => handleOnChange(e)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ thường trú</Form.Label>
                            <Form.Control
                                type="text"
                                name="dcThuongTru"
                                value={form.dcThuongTru}
                                onChange={(e) => handleOnChange(e)}
                            />
                        </Form.Group>
                        <Button variant="warning" onClick={() => handleUpdate()}>
                            Cập nhật
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default UserAccount;