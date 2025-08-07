import React, { useContext, useEffect, useState } from 'react';
import './HouseDetail.scss';
import { useParams, useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { fetchHouseDetailById } from '../../services/homeService';
import { Spinner } from 'react-bootstrap';
import { UserContext } from "../../context/UserContext";

const HouseDetail = () => {
    const { user } = useContext(UserContext);

    const { id } = useParams();
    const history = useHistory();

    const [loading, setLoading] = useState(true);

    const [house, setHouse] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRoleWarningModal, setShowRoleWarningModal] = useState(false);

    useEffect(() => {
        const getDetail = async () => {
            setLoading(true);
            const res = await fetchHouseDetailById(id);
            if (res && res.EC === 0) {
                setHouse(res.DT);
            }
            setLoading(false);
        };
        getDetail();
    }, [id]);

    const handleRoomClick = (room) => {
        if (room?.BangMa?.giaTri !== "Đã thuê") {
            setSelectedRoom(room);
            setShowModal(true);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRoom(null);
    }

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" variant="primary" />
                <div className="mt-2">Đang tải dữ liệu...</div>
            </div>
        );
    }

    const handleBooking = () => {
        if (user && user.isAuthenticated === true) {
            if (user.account?.quyenCuaNhom?.id === 3) {
                history.push(`/house/booking/${selectedRoom.id}`);
            } else {
                setShowModal(false);
                setShowRoleWarningModal(true);
            }
        } else {
            setShowModal(false);
            setShowLoginModal(true);
        }
    }

    return (
        <div className="container mt-3">
            <div className="house-detail-container">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <span onClick={() => history.push('/')}>
                                Trang chủ
                            </span>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {house.ten}
                        </li>
                    </ol>
                </nav>

                <h3>{house.ten}</h3>
                <hr />
                <p><i className="fa fa-map-marker"></i> {house.diaChi}, {house.Xa.tenXa}, {house.Xa.Huyen.tenHuyen}, {house.Xa.Tinh.tenTinh}</p>
                <p><i className="fa fa-info-circle"></i> {house.moTa || "Chưa có mô tả."}</p>

                <h5 className="mt-4">Danh sách phòng</h5>
                <div className="d-flex flex-wrap gap-3">
                    {house.Phongs?.length > 0 ? house.Phongs.map(room => {
                        const status = room.BangMa?.giaTri;
                        const isClickable = status !== "Đã thuê";
                        return (
                            <button
                                key={room.id}
                                className={`btn ${status === "Còn trống" ? 'btn-outline-primary' : 'btn-secondary'}`}
                                onClick={() => isClickable && handleRoomClick(room)}
                                disabled={!isClickable}
                                title={status === "Còn trống" ? 'Xem chi tiết và đặt phòng' : `Phòng ${status.toLowerCase()}`}
                            >
                                {room.tenPhong}
                            </button>
                        );
                    }) : <p>Không có phòng nào.</p>}
                </div>

                {house.AnhNhas?.length > 0 && (
                <>
                    <h5 className="mt-4">Ảnh</h5>
                    <div className="row mb-4">
                        {house.AnhNhas?.map((img, index) => (
                            <div className="col-md-4 col-sm-6 mb-3" key={index}>
                                <div
                                    className="house-image-wrapper"
                                    onClick={() => setPreviewImage(img.duongDan)}
                                >
                                    <img src={img.duongDan} alt={`Ảnh ${index + 1}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </>
                )}

                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Chi tiết phòng {selectedRoom?.tenPhong}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="d-flex justify-content-between py-1">
                            <strong>Tên phòng:</strong>
                            <span>{selectedRoom?.tenPhong}</span>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                            <strong>Giá thuê:</strong>
                            <span>{Number(selectedRoom?.giaThue)?.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                            <strong>Diện tích:</strong>
                            <span>{selectedRoom?.dienTich} m²</span>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                            <strong>Sức chứa:</strong>
                            <span>{selectedRoom?.sucChua} người</span>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                            <strong>Gác lửng:</strong>
                            <span>{selectedRoom?.coGacXep === true ? "Có" : "Không"}</span>
                        </div>
                        <div className="d-flex justify-content-between py-1">
                            <strong>Trạng thái:</strong>
                            <span>{selectedRoom?.BangMa?.giaTri}</span>
                        </div>
                        {selectedRoom?.PhongTaiSans?.length > 0 && (
                            <>
                                <hr />
                                <h6>Tài sản đi kèm</h6>
                                <ul className="list-group">
                                    {selectedRoom?.PhongTaiSans.map((pts, idx) => (
                                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-start">
                                            <div>
                                                <div><strong>{pts.TaiSan?.tenTaiSan}</strong> ({pts.soLuong} {pts.TaiSan?.dvtTaiSan?.toLowerCase()})</div>
                                                <small>{pts.TaiSan?.moTaTaiSan}</small>
                                            </div>
                                            <span className="badge bg-info">{pts.tinhTrang}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleCloseModal()}>Đóng</Button>
                        {selectedRoom?.BangMa?.giaTri === "Còn trống" && (
                            <Button variant="success" onClick={() => handleBooking()}>
                                Đặt phòng
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>

                <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Yêu cầu đăng nhập</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Bạn cần đăng nhập để thực hiện chức năng đặt phòng.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {setShowLoginModal(false); setShowModal(true)}}>
                            Quay lại
                        </Button>
                        <Button variant="primary" onClick={() => {
                            setShowLoginModal(false);
                            history.push("/login");
                        }}>
                            Tiếp tục
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showRoleWarningModal} onHide={() => setShowRoleWarningModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Không đủ quyền</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Chức năng đặt phòng chỉ dành cho tài khoản sinh viên.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="warning" onClick={() => {setShowRoleWarningModal(false); setShowModal(true)}}>
                            Quay lại
                        </Button>
                    </Modal.Footer>
                </Modal>

                {previewImage && (
                    <div className="lightbox-overlay" onClick={() => setPreviewImage(null)}>
                        <img src={previewImage} alt="Xem ảnh lớn" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default HouseDetail;