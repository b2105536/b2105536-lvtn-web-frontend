import { Modal, Button } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import { formatDateVN, removeVietnameseTones } from '../../utils/invoiceHelper';
import { fetchDetailInvoice } from '../../services/paymentService';
import html2pdf from 'html2pdf.js';

const ModalDetailInvoice = (props) => {
    const { show, onHide, hoaDonId } = props;

    const [data, setData] = useState(null);
    const [dien, setDien] = useState({ csTrc: 0, csSau: 0 });
    const [nuoc, setNuoc] = useState({ csTrc: 0, csSau: 0 });

    const contentRef = useRef();

    useEffect(() => {
        if (hoaDonId) {
            fetchDetailInvoice(hoaDonId).then(res => {
                if (res?.EC === 0) {
                    setData(res.DT);

                    const dienDV = res.DT.DichVus.find(dv => dv.tenDV.toLowerCase() === 'điện');
                    const nuocDV = res.DT.DichVus.find(dv => dv.tenDV.toLowerCase() === 'nước');
    
                    setDien({
                        csTrc: dienDV?.csTrc || 0,
                        csSau: dienDV?.csSau || 0
                    });
    
                    setNuoc({
                        csTrc: nuocDV?.csTrc || 0,
                        csSau: nuocDV?.csSau || 0
                    });
                }
            });
        }
    }, [hoaDonId]);

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

    const handlePrint = () => {
        const printContent = contentRef.current.innerHTML;
        const newWin = window.open('', '', 'width=800,height=600');
        newWin.document.write(`<html><head><title>Biên nhận thanh toán</title>`);
        newWin.document.write(`<style>body{font-family:Arial;padding:20px;}</style></head><body>`);
        newWin.document.write(printContent);
        newWin.document.write('</body></html>');
        newWin.document.close();
        newWin.print();
    };

    const handleDownloadPDF = () => {
        const element = contentRef.current;
        const opt = {
            margin:       0.5,
            filename:     `hoa-don-${hoaDonId}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save();
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    Hóa đơn tiền trọ
                    <small className="ms-2 text-muted">
                        (Biên nhận thanh toán)
                    </small>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {data ? (
                    <div ref={contentRef} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0 }}>HÓA ĐƠN TIỀN TRỌ</h3>
                            <div style={{ fontSize: '14px', color: '#555' }}>{data.ten} - SĐT: {data.soDienThoai}</div>
                            <hr />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <strong>Phòng: {data.tenPhong}</strong>
                            <strong>Kỳ: {new Date(data.ngayTao).getMonth() + 1}/{new Date(data.ngayTao).getFullYear()}</strong>
                            <strong>Số: {data.hoaDonId}</strong>
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Sinh viên: {removeVietnameseTones(data.hoTen)}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                <div key={idx} style={{ marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            {idx + 1}. {dv.tenDV}
                                            {isDien || isNuoc ? (
                                                <span style={{ fontSize: '12px', color: '#666' }}>
                                                    &nbsp;( Sử dụng: {soLuong} x {donGia.toLocaleString('vi-VN')} = {thanhTien.toLocaleString('vi-VN')} VNĐ )
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '12px', color: '#666' }}>
                                                    &nbsp;( Đơn giá: {donGia.toLocaleString('vi-VN')} VNĐ )
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-end">
                                            {thanhTien.toLocaleString('vi-VN')} VNĐ
                                        </div>
                                    </div>
        
                                    {(isDien || isNuoc) && (
                                        <div style={{ fontSize: '14px', color: '#555', marginLeft: '16px' }}>
                                            Chỉ số trước: <strong>{isDien ? dien.csTrc : nuoc.csTrc}</strong>,
                                            Chỉ số sau: <strong>{isDien ? dien.csSau : nuoc.csSau}</strong>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <hr />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>Tổng tiền phải trả:</strong>
                            <strong>{tinhTong().toLocaleString('vi-VN')} VNĐ</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>Số tiền đã trả:</strong>
                            <strong>{Number(data.soTienDaTra).toLocaleString('vi-VN')} VNĐ</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>Còn lại:</strong>
                            <strong>{Math.abs(Number(data.tienDuThangTrc)).toLocaleString('vi-VN')} VNĐ</strong>
                        </div>
                        {data.ghiChuHD && (
                            <div style={{ fontSize: '13px', color: '#555', marginTop: '5px' }}>
                                (Ghi chú: {data.ghiChuHD})
                            </div>
                        )}
                        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <strong>Ngày tạo:</strong>
                            <strong>{formatDateVN(data.ngayTao)}</strong>
                        </div>
                    </div>
                ) : <p>Đang tải dữ liệu...</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}><i className="fa fa-close me-1"></i>Đóng</Button>
                <Button variant="warning" onClick={() => handleDownloadPDF()}><i className="fa fa-save me-1"></i>Lưu trữ</Button>
                <Button variant="primary" onClick={() => handlePrint()}><i className="fa fa-print me-1"></i>In hóa đơn</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalDetailInvoice;
