import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchContractById, extendContract } from "../../services/contractService";
import { getMonthsBetween } from "../../utils/contractHelper";

const ModalExtendContract = (props) => {
    const { show, onHide, hopDongId, refresh } = props;

    const [contract, setContract] = useState(null);
    const [extendMonths, setExtendMonths] = useState(1);
    const [remainingMonths, setRemainingMonths] = useState(null);

    useEffect(() => {
        if (show && hopDongId) {
            getContractDetail();
        }
    }, [show, hopDongId]);

    const getContractDetail = async () => {
        let res = await fetchContractById(hopDongId);
        if (res && res.EC === 0) {
            setContract(res.DT);
            setRemainingMonths(getMonthsBetween(res.DT.ngayKT, new Date()));
        } else {
            toast.error(res.EM || "Không lấy được thông tin hợp đồng");
        }
    }

    const handleExtend = async () => {
        if (!extendMonths || extendMonths <= 0) {
            toast.error("Vui lòng nhập số tháng hợp lệ");
            return;
        }

        if (remainingMonths > 1) {
            toast.error("Hợp đồng còn hơn 1 tháng, không thể gia hạn.");
            return;
        }

        let res = await extendContract(hopDongId, extendMonths);
        if (res && res.EC === 0) {
            toast.success(res.EM);
            onHide();
            if (refresh) refresh();
        } else {
            toast.error(res.EM || "Gia hạn thất bại");
        }
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Gia hạn hợp đồng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {contract ? (
                    <>
                        <div className="mb-2 row">
                            <div className="col-6"><strong>Ngày bắt đầu:</strong></div>
                            <div className="col-6">{new Date(contract.ngayBD).toLocaleDateString()}</div>
                        </div>
                        <div className="mb-2 row">
                            <div className="col-6"><strong>Ngày kết thúc hiện tại:</strong></div>
                            <div className="col-6">{new Date(contract.ngayKT).toLocaleDateString()}</div>
                        </div>
                        <div className="mb-2 row">
                            <div className="col-6"><strong>Thời hạn hiệu lực:</strong></div>
                            <div className="col-6">{getMonthsBetween(contract.ngayKT, contract.ngayBD)} tháng</div>
                        </div>
                        <div className="mb-2 row">
                            <div className="col-6"><strong>Thời hạn còn lại:</strong></div>
                            <div className="col-6">{remainingMonths} tháng</div>
                        </div>
                        {remainingMonths <= 1 ? (
                            <Form.Group>
                                <Form.Label>Gia hạn thêm (tháng)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={extendMonths}
                                    onChange={(e) => setExtendMonths(e.target.value)}
                                />
                            </Form.Group>
                        ) : (
                            <p style={{ color: 'red', fontStyle: 'italic' }}>
                                Không thể gia hạn vì hợp đồng còn thời hạn trên 1 tháng.
                            </p>
                        )}
                    </>
                ) : (
                    <p>Đang tải...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
                {remainingMonths !== null && remainingMonths <= 1 && (
                    <Button variant="primary" onClick={() => handleExtend()}>Xác nhận</Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default ModalExtendContract;