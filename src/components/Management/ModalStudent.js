import { useEffect, useState } from "react";
import './ModalStudent.scss';
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { createOrLinkTenant } from "../../services/managementService";

const ModalStudent = (props) => {
    const { show, onHide, roomId, rent, user, refreshRooms } = props;

    const [hoTen, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [soDienThoai, setMobile] = useState("");

    useEffect (() => {
        if (show) {
            setFullname("");
            setEmail("");
            setMobile("");
        }
    }, [show]);

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
        
        if (!hoTen || !email || !soDienThoai) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error("Email không hợp lệ.");
            return;
        }

        if (!mobileRegex.test(soDienThoai)) {
            toast.error("Số điện thoại không hợp lệ.");
            return;
        }

        let res = await createOrLinkTenant({
            hoTen,
            email,
            soDienThoai,
            phongId: roomId,
            emailChuTro: user?.account?.email,
            giaThue: rent
        });
        
        if (res && res.EC === 0) {
            toast.success("Thêm khách thuê thành công.");
            onHide();
            refreshRooms(); // reload room list
        } else {
            toast.error(res.EM || "Đã xảy ra lỗi.");
        }
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" size="md" centered className="modal-student">
            <Modal.Header closeButton>
                <Modal.Title>Thêm khách thuê</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Họ tên (<span className='red'>*</span>)</Form.Label>
                        <Form.Control
                            type="text"
                            value={hoTen}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email (<span className='red'>*</span>)</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Số điện thoại (<span className='red'>*</span>)</Form.Label>
                        <Form.Control
                            type="text"
                            value={soDienThoai}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Hủy</Button>
                <Button variant="primary" onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalStudent;
