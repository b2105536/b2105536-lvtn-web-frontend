import { Modal, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { formatDateVN, removeVietnameseTones } from '../../utils/invoiceHelper';
import { fetchShowInvoiceData } from '../../services/managementService';

const ModalShowInvoice = (props) => {
    const { show, onHide, hopDongId } = props;
    const [data, setData] = useState(null);
    const [dien, setDien] = useState({ csTrc: 0, csSau: 0 });
    const [nuoc, setNuoc] = useState({ csTrc: 0, csSau: 0 });

    useEffect(() => {
        if (hopDongId) {
            fetchShowInvoiceData(hopDongId).then(res => {
                if (res?.EC === 0) {
                    setData(res.DT);
                    console.log(res.DT)

                    const dienDV = res.DT.DichVus.find(dv => dv.tenDV.toLowerCase() === 'điện');
                    const nuocDV = res.DT.DichVus.find(dv => dv.tenDV.toLowerCase() === 'nước');

                    setDien({
                        csTrc: dienDV?.csTrcGanNhat || 0,
                        csSau: dienDV?.csSauGanNhat || 0
                    });

                    setNuoc({
                        csTrc: nuocDV?.csTrcGanNhat || 0,
                        csSau: nuocDV?.csSauGanNhat || 0
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

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Giấy báo tiền trọ 
                    <small className="ms-2 text-muted">
                        (Không phải biên nhận thu tiền)
                    </small>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {data ? (
                    <>
                        <div className="mb-2">
                            <strong>Ngày ghi nhận: {formatDateVN(data.ngayGN)}</strong>
                        </div>
                        <div className="mb-2">
                            <strong>Sinh viên: {removeVietnameseTones(data.hoTen)}</strong>
                        </div>
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
                                                    ( Sử dụng: {soLuong} x {donGia.toLocaleString('vi-VN')} = {thanhTien.toLocaleString('vi-VN')} VNĐ )
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
                                                <div>Chỉ số trước: <strong>{isDien ? dien.csTrc : nuoc.csTrc}</strong></div>
                                            </div>
                                            <div className="col-6 col-md-3">
                                                <div>Chỉ số sau: <strong>{isDien ? dien.csSau : nuoc.csSau}</strong></div>
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
                        <div className="text-muted small">
                            (Lưu ý: Giấy báo tiền trọ không có giá trị thay thế biên nhận đã thanh toán.<br/>
                            Sinh viên cần yêu cầu chủ nhà trọ cung cấp Biên nhận đã thanh toán khi thanh toán tiền trọ.)
                        </div>
                    </>
                ) : <p>Đang tải dữ liệu...</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalShowInvoice;
