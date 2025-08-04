import React, { useState, useEffect } from 'react';
import './ModalEditRoom.scss';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updateRoomInfo } from '../../services/managementService';
import { fetchRoomStatus } from '../../services/roomService';

const ModalEditRoom = (props) => {
    const { show, onHide, roomId, roomName, roomRent, roomStat, hasContract, refresh } = props;
    const [tenPhong, setRoomName] = useState(roomName);
    const [giaThue, setRoomRent] = useState(roomRent);
    const [ttPhongId, setRoomStat] = useState(roomStat);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        if (show) {
            setRoomName(roomName);
            setRoomRent(roomRent);
            setRoomStat(roomStat);
        }
    }, [show, roomName, roomRent, roomStat]);

    useEffect(() => {
        getRoomStatuses();
    }, []);

    const getRoomStatuses = async () => {
        const res = await fetchRoomStatus();
        if (res && res.EC === 0) {
            setStatuses(res.DT);
        } else {
            toast.error(res.EM);
        }
    }

    const handleSave = async () => {
        if (!tenPhong || !giaThue || !ttPhongId) {
            toast.warning("Vui lòng nhập đầy đủ thông tin");
            return;
        }
        const data = { id: roomId, tenPhong, giaThue, ttPhongId };

        const res = await updateRoomInfo(data);
        if (res && res.EC === 0) {
            toast.success(res.EM);
            refresh();
            onHide();
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <Modal show={show} onHide={onHide} className="modal-edit-room">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa thông tin phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label><span className="red me-1">*</span>Tên phòng</Form.Label>
                        <Form.Control
                            type="text"
                            value={tenPhong}
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><span className="red me-1">*</span>Giá thuê (VNĐ)</Form.Label>
                        <Form.Control
                            type="text"
                            value={giaThue}
                            onChange={(e) => setRoomRent(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><span className="red me-1">*</span>Trạng thái phòng</Form.Label>
                        <div>
                            {statuses.map(status => (
                                <Form.Check
                                    key={status.id}
                                    inline
                                    label={status.giaTri}
                                    name="roomStatus"
                                    type="radio"
                                    id={`status-${status.id}`}
                                    checked={Number(ttPhongId) === status.id}
                                    onChange={() => setRoomStat(status.id)}
                                    disabled={
                                        (hasContract || Number(roomStat) === 5) && status.id !== Number(roomStat)
                                    }
                                />
                            ))}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onHide()}>Hủy</Button>
                <Button variant="primary" onClick={() => handleSave()}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEditRoom;