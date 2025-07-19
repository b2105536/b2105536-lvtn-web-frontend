import { useEffect, useState } from "react";
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
        if (!hoTen || !email || !soDienThoai) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        let res = await createOrLinkTenant({
            hoTen, email, soDienThoai, phongId: roomId, emailChuTro: user?.account?.email, giaThue: rent });
        console.log(res)
        console.log(res.DT)
        if (res && res.EC === 0) {
            toast.success("Thêm khách thuê thành công.");
            onHide();
            refreshRooms(); // reload room list
        } else {
            toast.error(res.EM || "Đã xảy ra lỗi.");
        }
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" size="md" centered>
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
