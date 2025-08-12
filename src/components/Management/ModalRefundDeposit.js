import { useState, useEffect } from "react";
import './ModalRefundDeposit.scss';
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { updateDeposit } from "../../services/cashflowService";

const ModalRefundDeposit = (props) => {
    const { show, onHide, room } = props;

    const [refundAmount, setRefundAmount] = useState(0);

    useEffect(() => {
        if (show && room) {
            setRefundAmount(room.tienCoc || 0);
        }
    }, [show, room]);

    const handleConfirmRefund = async () => {
        if (!room) return;

        const refund = Number(refundAmount);
        const deposit = Number(room.tienCoc);

        if (refund < 0) {
            toast.error("Số tiền hoàn trả không hợp lệ");
            return;
        }

        if (refund > deposit) {
            toast.error("Số tiền hoàn trả không được vượt quá tiền cọc hiện tại");
            return;
        }

        const newDeposit = deposit - refund;
        let res = await updateDeposit(room.roomId, newDeposit);

        if (res && res.EC === 0) {
            toast.success(res.EM);
            onHide(true);
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <Modal show={show} onHide={() => onHide(false)} centered className="modal-refund">
            <Modal.Header closeButton>
                <Modal.Title>Hoàn trả tiền cọc</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {room ? (
                    <>
                        <p><strong>Sinh viên:</strong> {room.hoTen}</p>
                        <p><strong>Phòng:</strong> {room.tenPhong}</p>
                        <p><strong>Tiền đặt cọc hiện tại:</strong> {Number(room.tienCoc).toLocaleString("vi-VN")} VNĐ</p>

                        <Form.Group className="mt-3">
                            <Form.Label><span className="red">*</span>Số tiền hoàn trả</Form.Label>
                            <Form.Control
                                type="text"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                            />
                        </Form.Group>
                    </>
                ) : (
                    <p className="text-muted">Không có dữ liệu phòng.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onHide(false)}>Đóng</Button>
                <Button variant="warning" onClick={() => handleConfirmRefund()}>Xác nhận</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalRefundDeposit;