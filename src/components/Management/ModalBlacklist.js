import { useEffect, useState } from "react";
import './ModalBlacklist.scss';
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { addToBlacklist, unblockStudent } from "../../services/blacklistService";

const ModalBlacklist = (props) => {
    const { show, handleClose, sinhVienId, sinhVienName, refresh, reopenStudentInfo, blacklistInfo, onBlacklistSuccess } = props;

    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    const reasons = [
        "Không trả tiền thuê nhà liên tục trong ba tháng mà không có lý do chính đáng",
        "Tự ý sửa chữa, đục phá kết cấu, cải tạo hoặc cơi nới nhà ở thuê",
        "Tự ý chuyển quyền thuê cho người khác hoặc cho người khác cùng sử dụng nhà ở",
        "Vi phạm nội quy, được nhắc nhở nhiều lần nhưng không thay đổi",
        "Gây mất trật tự, ảnh hưởng đến sinh hoạt chung của người thuê khác",
        "Khác"
    ];

    const resetForm = () => {
        setSelectedReason("");
        setCustomReason("");
    };

    useEffect (() => {
        if (!show) resetForm();
    }, [show]);

    const handleSubmit = async () => {
        if (selectedReason === "Khác" && (!customReason || customReason.trim() === "")) {
            toast.error("Vui lòng nhập lý do cụ thể.");
            return;
        }

        let finalReason = selectedReason === "Khác" ? customReason : selectedReason;
        if (!finalReason || finalReason.trim() === "") {
            toast.error("Vui lòng bổ sung lý do.");
            return;
        }

        const res = await addToBlacklist({ sinhVienId, lyDo: finalReason });
        if (res.EC === 0) {
            if (onBlacklistSuccess) {
                onBlacklistSuccess(res.DT);
            }
            toast.success(res.EM);
            refresh();
            handleClose();
        } else {
            toast.error(res.EM);
        }
    }

    const handleUnblock = async () => {
        const res = await unblockStudent(sinhVienId);
        if (res.EC === 0) {
            if (onBlacklistSuccess) {
                onBlacklistSuccess(res.DT);
            }
            toast.success(res.EM);
            refresh();
            handleClose();
            reopenStudentInfo();
        } else {
            toast.error(res.EM);
        }
    }

    const isBlocked = !!blacklistInfo;

    return (
        <Modal show={show} onHide={handleClose} centered className="modal-blacklist">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isBlocked ? "Thông tin blacklist" : "Thêm vào blacklist"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <strong>Sinh viên:</strong> <span>{sinhVienName}</span>
                </div>
                {isBlocked ? (
                    <>
                        <hr />
                        <div className="mb-2">
                            <strong>Ngày chặn:</strong> {new Date(blacklistInfo?.ngayChan).toLocaleDateString("vi-VN")}
                        </div>
                        <div>
                            <strong>Lý do:</strong> {blacklistInfo.lyDo}
                        </div>
                    </>
                ) : (
                    <>
                        <Form.Group className="mb-3">
                            <Form.Label><span className="red">*</span><strong>Lý do:</strong></Form.Label>
                            <Form.Select
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                            >
                                <option value="">-- Chọn lý do --</option>
                                {reasons.map((reason, idx) => (
                                    <option key={idx} value={reason}>{reason}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        {selectedReason === "Khác" && (
                            <Form.Group>
                                <Form.Label><span className="red">*</span><strong>Cụ thể:</strong></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Nhập lý do..."
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                />
                            </Form.Group>
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary"
                    onClick={() => {
                        handleClose();
                        if (isBlocked) reopenStudentInfo();
                    }}
                >
                    {isBlocked ? "Đóng" : "Hủy"}
                </Button>

                {isBlocked ? (
                    <Button variant="success" onClick={() => handleUnblock()}><i class="fa fa-unlock"></i> Bỏ chặn</Button>
                ) : (
                    <Button variant="danger" onClick={() => handleSubmit()}>Xác nhận</Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default ModalBlacklist;