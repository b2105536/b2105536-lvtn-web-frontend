import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fetchBookingsByRoom } from '../../services/managementService';
import { formatDateVN } from '../../utils/invoiceHelper';

const ModalBookingList = (props) => {
    const { show, handleClose, roomId } = props;
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (roomId) {
            fetchBookings();
        }
    }, [roomId]);

    const fetchBookings = async () => {
        const res = await fetchBookingsByRoom(roomId);
        if (res && res.EC === 0) {
            setBookings(res.DT);
        } else {
            setBookings([]);
        }
    };

    return (
        <Modal show={show} onHide={() => handleClose()} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Danh sách đặt phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {bookings.length > 0 ? (
                    <ul className="list-group">
                        {bookings.map((item, index) => (
                            <li className="list-group-item" key={index}>
                                <strong>Sinh viên:</strong> {item.sinhVien?.hoTen || 'N/A'}&emsp;|&emsp;{item.sinhVien?.email || 'N/A'}&emsp;|&emsp;{item.sinhVien?.soDienThoai || 'N/A'} <br />
                                <strong>Ngày đặt:</strong> {formatDateVN(item.ngayDat) || 'N/A'} <br />
                                <strong>Nội dung:</strong> {item.dienGiai || 'Không có'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Không có lượt đặt phòng nào.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose()}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalBookingList;