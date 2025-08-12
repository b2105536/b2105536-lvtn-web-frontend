import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalBlacklist from './ModalBlacklist';

const ModalStudentInfo = (props) => {
    const { show, handleClose, sinhVien, refresh } = props;
    
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [showBlacklistModal, setShowBlacklistModal] = useState(false);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        let date = new Date(dateStr);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    const openBlacklist = () => {
        setSelectedStudentId(sinhVien.id);
        setShowBlacklistModal(true);
    }

    const closeBlacklist = () => {
        setShowBlacklistModal(false);
    }

    return (
        <>
            <Modal show={show && !showBlacklistModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thông tin khách thuê</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {sinhVien ? (
                    <>
                        <div className="d-flex justify-content-between mb-2">
                            <strong>Họ tên:</strong>
                            <span>{sinhVien.hoTen}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <strong>Email:</strong>
                            <span>{sinhVien.email}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <strong>SĐT:</strong>
                            <span>{sinhVien.soDienThoai}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <strong>Số định danh:</strong>
                            <span>{sinhVien.soDD}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <strong>Giới tính:</strong>
                            <span>{sinhVien.gioiTinh === false ? 'Nữ' : 'Nam'}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <strong>Ngày sinh:</strong>
                            <span>{formatDate(sinhVien.ngaySinh)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <strong>Địa chỉ thường trú:</strong>
                            <span>{sinhVien.dcThuongTru}</span>
                        </div>
                    </>
                    ) : (
                        <p>Phòng này chưa có khách thuê.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Đóng
                    </Button>
                    {sinhVien && (
                        <Button variant="outline-danger"
                            onClick={() => openBlacklist()}
                        >
                            <i class="fa fa-ban"></i>{" "}
                            {sinhVien?.Blacklist ? "Đã chặn" : "Chặn"}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
            
            <ModalBlacklist
                show={showBlacklistModal}
                handleClose={() => closeBlacklist()}
                sinhVienId={selectedStudentId}
                sinhVienName={sinhVien?.hoTen}
                blacklistInfo={sinhVien?.Blacklist}
                refresh={refresh}
                onBlacklistSuccess={(newBlacklist) => {
                    sinhVien.Blacklist = newBlacklist;
                }}
                reopenStudentInfo={() => setShowBlacklistModal(false)}
            />
        </>
    );
};

export default ModalStudentInfo;