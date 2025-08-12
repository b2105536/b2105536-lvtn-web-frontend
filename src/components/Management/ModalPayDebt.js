import { useEffect, useState } from "react";
import './ModalPayDebt.scss';
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { payDebt } from "../../services/cashflowService";

const ModalPayDebt = (props) => {
    const { show, onHide, room, onSuccess } = props;

    const [amount, setAmount] = useState("");

    useEffect(() => {
        if (show) {
            setAmount("");
        }
    }, [show]);

    const handleSubmit = async () => {
        if (!amount || Number(amount) <= 0) {
            toast.error("Số tiền phải lớn hơn 0");
            return;
        }
        let res = await payDebt(room.roomId, Number(amount));
        if (res && res.EC === 0) {
            toast.success(res.EM);
            onSuccess();
            onHide(true);
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <Modal show={show} onHide={() => onHide(false)} centered className="modal-pay-debt">
            <Modal.Header closeButton>
                <Modal.Title>Thu tiền nợ - {room?.tenPhong}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Sinh viên:</strong> {room?.hoTen}</p>
                <p><strong>Nợ hiện tại:</strong> {Math.abs(Number(room?.tienNo)).toLocaleString("vi-VN")} VNĐ</p>
                <Form.Group>
                    <Form.Label><span className="red">*</span>Số tiền thu</Form.Label>
                    <Form.Control
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onHide(false)}>Đóng</Button>
                <Button variant="success" onClick={() => handleSubmit()}>Xác nhận</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalPayDebt;