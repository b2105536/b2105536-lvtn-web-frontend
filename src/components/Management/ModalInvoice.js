import { Modal, Button, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatDateVN } from '../../utils/dateHelper';
import { fetchInvoiceData, saveInvoice } from '../../services/managementService'; // thêm saveInvoice

const ModalInvoice = (props) => {
    const { show, onHide, hopDongId } = props;
    const [data, setData] = useState(null);
    const [dien, setDien] = useState({ csTrc: '', csSau: '' });
    const [nuoc, setNuoc] = useState({ csTrc: '', csSau: '' });

    useEffect(() => {
        if (hopDongId) {
            fetchInvoiceData(hopDongId).then(res => {
                if (res?.EC === 0) {
                    setData(res.DT);

                    const dienDV = res.DT.DichVus.find(dv => dv.tenDV.toLowerCase() === 'điện');
                    const nuocDV = res.DT.DichVus.find(dv => dv.tenDV.toLowerCase() === 'nước');

                    setDien({
                        csTrc: dienDV?.csTrcGanNhat || 0,
                        csSau: ''
                    });

                    setNuoc({
                        csTrc: nuocDV?.csTrcGanNhat || 0,
                        csSau: ''
                    });
                }
            });
        }
    }, [hopDongId]);

    const calcTien = (csTrc, csSau, donGia) => {
        const s = csSau - csTrc;
        return s > 0 ? s * donGia : 0;
    };

    const tinhTong = () => {
        if (!data) return 0;
        let tong = Number(data.giaThue) || 0;
        data.DichVus.forEach(dv => {
            const ten = dv.tenDV.toLowerCase();
            if (ten === 'điện') tong += calcTien(dien.csTrc, dien.csSau, Number(dv.donGia));
            else if (ten === 'nước') tong += calcTien(nuoc.csTrc, nuoc.csSau, Number(dv.donGia));
            else tong += Number(dv.donGia);
        });
        return tong;
    };

    const handleSubmitInvoice = async () => {
        const dienDV = data.DichVus.find(dv => dv.tenDV.toLowerCase() === 'điện');
        const nuocDV = data.DichVus.find(dv => dv.tenDV.toLowerCase() === 'nước');
        const dichVuKhac = data.DichVus.filter(
            dv => !['điện', 'nước'].includes(dv.tenDV.toLowerCase())
        );

        const payload = {
            hopDongId,
            ngayGN: data?.ngayGN,
            dien: dienDV ? {
                dichVuId: dienDV.dichVuId,
                csTrc: dien.csTrc,
                csSau: dien.csSau
            } : null,
            nuoc: nuocDV ? {
                dichVuId: nuocDV.dichVuId,
                csTrc: nuoc.csTrc,
                csSau: nuoc.csSau
            } : null,
            dichVuKhac: dichVuKhac.map(dv => ({ dichVuId: dv.dichVuId })),
            tongTien: tinhTong()
        };

        const res = await saveInvoice(payload);
        if (res?.EC === 0) {
            toast.success(res.EM);
            onHide();
        } else {
            toast.error(res.EM);
        }
    };

    const removeVietnameseTones = (str) => {
        return str.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d").replace(/Đ/g, "D")
            .toUpperCase();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Giấy báo tiền trọ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {data ? (
                    <>
                        <div className="mb-2">
                            <strong>Ngày ghi nhận: {formatDateVN(data.ngayGN)}</strong>
                        </div>
                        <div className="mb-2"><strong>Sinh viên: {removeVietnameseTones(data.hoTen)}</strong></div>
                        <div className="mb-2 d-flex justify-content-between">
                            Tiền thuê phòng:
                            <span>{Number(data.giaThue).toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                        <hr />
                        {data.DichVus.map((dv, idx) => {
                            const ten = dv.tenDV.toLowerCase();
                            const isDien = ten === 'điện';
                            const isNuoc = ten === 'nước';

                            const donGia = Number(dv.donGia);
                            const soLuong = isDien
                                ? dien.csSau - dien.csTrc
                                : isNuoc
                                    ? nuoc.csSau - nuoc.csTrc
                                    : 0;

                            const thanhTien = isDien
                                ? calcTien(dien.csTrc, dien.csSau, donGia)
                                : isNuoc
                                    ? calcTien(nuoc.csTrc, nuoc.csSau, donGia)
                                    : donGia;

                            return (
                                <div key={idx} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            {idx + 1}. {dv.tenDV}
                                            {isDien || isNuoc ? (
                                                <span className="ms-2 text-muted small">
                                                    ( Sử dụng: {soLuong > 0 ? soLuong : 0} x {donGia.toLocaleString('vi-VN')} = {thanhTien.toLocaleString('vi-VN')} VNĐ )
                                                </span>
                                            ) : (
                                                <span className="ms-2 text-muted small">
                                                    ( Đơn giá: {donGia.toLocaleString('vi-VN')} VNĐ )
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-end">
                                            {thanhTien.toLocaleString('vi-VN')} VNĐ
                                        </div>
                                    </div>

                                    {(isDien || isNuoc) && (
                                        <div className="row mt-2">
                                            <div className="col-6 col-md-3">
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    className="form-control-sm"
                                                    placeholder="Chỉ số trước"
                                                    value={isDien ? dien.csTrc : nuoc.csTrc}
                                                    onChange={(e) => {
                                                        const val = +e.target.value;
                                                        isDien
                                                            ? setDien(p => ({ ...p, csTrc: val }))
                                                            : setNuoc(p => ({ ...p, csTrc: val }));
                                                    }}
                                                />
                                            </div>
                                            <div className="col-6 col-md-3">
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    className="form-control-sm"
                                                    placeholder="Chỉ số sau"
                                                    value={isDien ? dien.csSau : nuoc.csSau}
                                                    onChange={(e) => {
                                                        const val = +e.target.value;
                                                        isDien
                                                            ? setDien(p => ({ ...p, csSau: val }))
                                                            : setNuoc(p => ({ ...p, csSau: val }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <hr />
                        <div className="d-flex justify-content-between">
                            <strong>Tổng tiền:</strong>
                            <strong>{tinhTong().toLocaleString('vi-VN')} VNĐ</strong>
                        </div>
                    </>
                ) : <p>Đang tải dữ liệu...</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
                <Button variant="primary" onClick={handleSubmitInvoice}>Lưu giấy báo</Button>
            </Modal.Footer>
        </Modal>
    );

};

export default ModalInvoice;
