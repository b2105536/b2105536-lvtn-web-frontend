import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Spinner, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { fetchBookingRoomDetail, confirmBooking } from '../../services/homeService';
import { fetchUserAccountInfo } from '../../services/userService';
import { UserContext } from '../../context/UserContext';
import './Booking.scss';
import { toast } from 'react-toastify';

const Booking = () => {
    const history = useHistory();
    const { roomId } = useParams();
    const { user } = useContext(UserContext);
    const [sinhVienId, setSinhVienId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState(null);
    const [house, setHouse] = useState(null);

    const [agree, setAgree] = useState(false);

    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        soDienThoai: '',
    });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            const resRoom = await fetchBookingRoomDetail(roomId);
            if (resRoom?.EC === 0) {
                setRoom(resRoom.DT?.phong);
                setHouse(resRoom.DT?.nha);
            }

            const email = user?.account?.email;
            if (email) {
                const resUser = await fetchUserAccountInfo(email);
                if (resUser?.EC === 0) {
                    const { id, hoTen, email, soDienThoai } = resUser.DT;
                    setFormData({ hoTen, email, soDienThoai });
                    setSinhVienId(id);
                }
            }

            setLoading(false);
        };
        loadData();
    }, [roomId, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async () => {
        if (!formData.hoTen || !formData.email || !formData.soDienThoai) {
            toast.error("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (!agree) {
            toast.warning("Bạn phải đồng ý với cam kết trước khi đặt phòng.");
            return;
        }

        if (!sinhVienId) {
            toast.error("Không thể xác định tài khoản sinh viên.");
            return;
        }

        const res = await confirmBooking(roomId, formData, sinhVienId);
        if (res?.EC === 0) {
            toast.success(res.EM);
            history.push('/');
        } else {
            toast.error(res.EM);
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" />
                <div className="mt-2">Đang tải dữ liệu...</div>
            </div>
        );
    }

    return (
        <div className="container booking-page mt-3">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <span onClick={() => history.push('/')}>
                            Trang chủ
                        </span>
                    </li>
                    <li className="breadcrumb-item">
                        <span onClick={() => history.push(`/house/house-detail/${house.id}`)}>
                            {house.ten}
                        </span>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Đặt phòng
                    </li>
                </ol>
            </nav>

            <h3>Đặt phòng</h3>
            <hr />
            <Row className="mb-4">
                <Col md={6}>
                    <Card>
                        <Card.Header>Thông tin nhà trọ</Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <div><strong>Tên:</strong></div>
                                <div>{house?.ten}</div>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <div><strong>Địa chỉ:</strong></div>
                                <div>
                                    {house?.diaChi}, {house?.Xa?.tenXa}, {house?.Xa?.Huyen?.tenHuyen}, {house?.Xa?.Tinh?.tenTinh}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <div><strong>Mô tả:</strong></div>
                                <div>{house?.moTa || "Chưa có mô tả."}</div>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <div><strong>Chủ trọ:</strong></div>
                                <div>{house?.NguoiDung?.hoTen}</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div><strong>SĐT:</strong></div>
                                <div>{house?.NguoiDung?.soDienThoai}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Header>Thông tin phòng</Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <div><strong>Tên phòng:</strong></div>
                                <div>{room?.tenPhong}</div>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <div><strong>Giá thuê:</strong></div>
                                <div>{Number(room?.giaThue).toLocaleString()} VNĐ</div>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <div><strong>Diện tích:</strong></div>
                                <div>{room?.dienTich} m²</div>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <div><strong>Sức chứa:</strong></div>
                                <div>{room?.sucChua} người</div>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div><strong>Gác lửng:</strong></div>
                                <div>{room?.coGacXep ? "Có" : "Không"}</div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="mb-4">
                <Card.Header>Thông tin người đặt phòng</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label><span className="red me-1">*</span>Họ tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="hoTen"
                                value={formData.hoTen || ''}
                                onChange={handleInputChange}
                                placeholder="Nhập họ tên"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><span className="red me-1">*</span>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                placeholder="Nhập email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><span className="red me-1">*</span>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="soDienThoai"
                                value={formData.soDienThoai || ''}
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </Form.Group>
                        <Form.Group controlId="agreeCheck" className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Tôi cam đoan thông tin cá nhân mà tôi dùng để đặt phòng là đúng sự thật."
                                checked={agree}
                                onChange={(e) => setAgree(e.target.checked)}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="success" className="w-100" onClick={() => handleSubmit()} disabled={!agree}>
                                Xác nhận đặt phòng
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Booking;