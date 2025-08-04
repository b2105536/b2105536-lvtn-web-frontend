import React, { useEffect, useState } from 'react';
import './HouseDetail.scss';
import { useParams, useHistory } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { fetchHouseDetailById } from '../../services/homeService';
import { Spinner } from 'react-bootstrap';

const HouseDetail = () => {
    const { id } = useParams();
    const history = useHistory();

    const [loading, setLoading] = useState(true);

    const [house, setHouse] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

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
        if (room?.BangMa?.giaTri === "Còn trống") {
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
                        const isAvailable = room.BangMa?.giaTri === "Còn trống";
                        return (
                            <button
                                key={room.id}
                                className={`btn ${isAvailable ? 'btn-outline-primary' : 'btn-secondary'}`}
                                onClick={() => isAvailable && handleRoomClick(room)}
                                disabled={!isAvailable}
                                title={isAvailable ? 'Xem chi tiết và đặt phòng' : `Phòng ${room.BangMa?.giaTri.toLowerCase()}`}
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleCloseModal()}>Đóng</Button>
                        <Button variant="success" onClick={() => alert("Chức năng Đặt phòng sẽ triển khai sau.")}>
                            Đặt phòng
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