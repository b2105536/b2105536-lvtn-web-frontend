import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getInvoiceDataByContract, saveInvoicePayment } from "../../services/managementService";
import { toast } from "react-toastify";

const ModalConfirmInvoice = (props) => {
    const { show, onHide, hopDongId } = props;
    const [invoice, setInvoice] = useState(null);
    const [soTienDaTra, setSoTienDaTra] = useState('');
    const [ghiChuHD, setGhiChuHD] = useState('');

    useEffect(() => {
        if (hopDongId && show) {
            setInvoice(null);
            setSoTienDaTra('');
            setGhiChuHD('');
            fetchInvoiceData();
        }
    }, [hopDongId, show]);

    const fetchInvoiceData = async () => {
        const res = await getInvoiceDataByContract(hopDongId);
        
        if (res && res.EC === 0 && res.DT?.hoaDon) {
            setInvoice(res.DT);
            setSoTienDaTra(res.DT.hoaDon.soTienDaTra || '');
            setGhiChuHD(res.DT.hoaDon.ghiChuHD || '');
        } else {
            setInvoice(null);
            toast.info("Không có hóa đơn nào chưa thanh toán.");
        }
    };

    const handleSave = async () => {
        if (!soTienDaTra || isNaN(+soTienDaTra)) {
            toast.warning("Vui lòng nhập số tiền đã trả hợp lệ.");
            return;
        }

        const invoiceToUpdate = invoice?.hoaDon;
        if (!invoiceToUpdate) {
            toast.error("Không tìm thấy hóa đơn để cập nhật.");
            return;
        }

        const tienDuThangTrc = +soTienDaTra - invoiceToUpdate.tongTienPhaiTra;

        const res = await saveInvoicePayment({
            id: invoiceToUpdate.id,
            soTienDaTra: +soTienDaTra,
            tienDuThangTrc,
            ghiChuHD
        });

        if (res && res.EC === 0) {
            toast.success(res.EM);
            onHide();
        } else {
            toast.error(res.EM);
        }
    };

    const invoiceInfo = invoice?.hoaDon;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Xác nhận thanh toán</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {invoiceInfo ? (
                    <>
                        <p><strong>Sinh viên: {invoice.NguoiDung?.hoTen}</strong></p>
                        <p><strong>Tiền phải trả: {Number(invoiceInfo.tongTienPhaiTra).toLocaleString('vi-VN')} VNĐ</strong></p>
                        <Form.Group className="mb-3">
                            <Form.Label>Số tiền đã trả</Form.Label>
                            <Form.Control
                                type="text"
                                value={soTienDaTra}
                                onChange={(e) => setSoTienDaTra(e.target.value)}
                            />
                        </Form.Group>
                        {soTienDaTra && !isNaN(+soTienDaTra) && (
                            <p className="text-muted">
                                Tiền thừa: {(+soTienDaTra - invoiceInfo.tongTienPhaiTra).toLocaleString('vi-VN')} VNĐ
                            </p>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú hóa đơn</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={ghiChuHD}
                                onChange={(e) => setGhiChuHD(e.target.value)}
                            />
                        </Form.Group>
                    </>
                ) : (
                    <p>Đang tải hóa đơn...</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onHide()}>Đóng</Button>
                <Button variant="success" onClick={() => handleSave()}>Xác nhận</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalConfirmInvoice;
