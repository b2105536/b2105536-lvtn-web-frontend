import { useEffect, useState } from "react";
import './ModalCreateContract.scss';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchContractById, updateContract } from "../../services/contractService";
import { formatDateVN } from "../../utils/invoiceHelper";
import ContractPreview from "./ContractPreview";

const ModalCreateContract = (props) => {
    const { show, onHide, hopDongId, refresh } = props;

    const [contract, setContract] = useState(null);
    const [ngayKT, setNgayKT] = useState("");
    const [tienDatCoc, setTienDatCoc] = useState(0);

    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (show && hopDongId) {
            fetchContractData();
        }
    }, [show, hopDongId]);

    const fetchContractData = async () => {
        let res = await fetchContractById(hopDongId);
        if (res && res.EC === 0) {
            setContract(res.DT);
            setNgayKT(res.DT.ngayKT || "");
            setTienDatCoc(res.DT.tienDatCoc || 0);
        } else {
            toast.error(res.EM);
        }
    }

    const handleSave = async () => {
        let res = await updateContract(hopDongId, { ngayKT, tienDatCoc });
        if (res && res.EC === 0) {
            toast.success(res.EM);
            onHide();
            if (refresh) refresh();
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <>
            <Modal show={show} onHide={onHide} size="lg" className="modal-create-contract">
                <Modal.Header closeButton>
                    <Modal.Title>Lập hợp đồng bản giấy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {contract ? (
                        <Form>
                            <Row className="mb-2">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label><span className="red">*</span>Ngày lập</Form.Label>
                                        <Form.Control type="text" value={formatDateVN(contract.ngayLap)} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label><span className="red">*</span>Hợp đồng số</Form.Label>
                                        <Form.Control type="text" value={`${contract.id}/HĐ`} disabled />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label><span className="red">*</span>Tên nhà trọ</Form.Label>
                                        <Form.Control type="text" value={contract.Phong?.Nha?.ten || ""} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label><span className="red">*</span>Tên phòng</Form.Label>
                                        <Form.Control type="text" value={contract.Phong?.tenPhong || ""} disabled />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-2">
                                <Form.Label><span className="red">*</span>Địa chỉ nhà trọ</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={`${contract.Phong?.Nha?.diaChi || ""}, ${contract.Phong?.Nha?.Xa?.tenXa || ""}, ${contract.Phong?.Nha?.Xa?.Huyen?.tenHuyen || ""}, ${contract.Phong?.Nha?.Xa?.Tinh?.tenTinh || ""}`}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label><span className="red">*</span>Người cho thuê</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={`${contract.Phong?.Nha?.NguoiDung?.hoTen || ""} - ${contract.Phong?.Nha?.NguoiDung?.soDienThoai || ""}`}
                                    disabled
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label><span className="red">*</span>Người thuê</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={`${contract.NguoiDung?.hoTen || ""} - ${contract.NguoiDung?.gioiTinh === true ? "Nam": "Nữ" || ""} - ${contract.NguoiDung?.soDD || ""} - ${contract.NguoiDung?.soDienThoai || ""}`}
                                    disabled
                                />
                            </Form.Group>

                            <Row className="mb-2">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label><span className="red">*</span>Ngày bắt đầu</Form.Label>
                                        <Form.Control type="text" value={formatDateVN(contract.ngayBD)} disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label><span className="red">*</span>Ngày kết thúc</Form.Label>
                                        <Form.Control type="date" value={ngayKT} onChange={e => setNgayKT(e.target.value)} />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label><span className="red">*</span>Giá thuê</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={Number(contract.giaThueTrongHD)?.toLocaleString("vi-VN") || ""}
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label><span className="red">*</span>Tiền đặt cọc</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={tienDatCoc}
                                            onChange={e => setTienDatCoc(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    ) : (
                        <p>Đang tải...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>Hủy</Button>
                    <Button variant="dark" onClick={() => setShowPreview(true)}>Xem trước</Button>
                    <Button variant="primary" onClick={() => handleSave()}>Lưu</Button>
                </Modal.Footer>
            </Modal>

            { showPreview && (
                <Modal show={showPreview} onHide={() => setShowPreview(false)} size="xl" dialogClassName="modal-preview-dialog">
                    <Modal.Header closeButton>
                        <Modal.Title>Xem trước hợp đồng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <ContractPreview data={contract} ngayKT={ngayKT}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPreview(false)}>Đóng</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}

export default ModalCreateContract;