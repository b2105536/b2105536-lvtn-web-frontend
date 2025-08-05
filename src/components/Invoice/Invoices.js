import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { fetchAllInvoices, fetchAllBookings } from "../../services/paymentService";
import { Card, Button, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";
import { formatDateVN, removeVietnameseTones } from '../../utils/invoiceHelper';
import ModalDetailInvoice from "./ModalDetailInvoice";

const Invoices = (props) => {
    const { user } = useContext(UserContext);

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const [invoiceId, setInvoiceId] = useState(null);
    const [showModalDetailInvoice, setShowModalDetailInvoice] = useState(false);

    useEffect(() => {
        getInvoices();
        getBookings();
    }, []);

    const getInvoices = async () => {
        let res = await fetchAllInvoices(user.account.email);
        if (res && res.EC === 0) {
            setInvoices(res.DT);
            setLoading(false);
        } else {
            toast.error(res.EC);
        }
    }

    const getBookings = async () => {
        let res = await fetchAllBookings(user.account.email);
        if (res && res.EC === 0) {
            setBookings(res.DT);
            setLoadingBookings(false);
        } else {
            toast.error(res.EM);
        }
    }

    if (loading) return (
        <div className='loading-container'>
            <Spinner animation="border" className="text-primary" />
            <div className="mt-2">Đang tải dữ liệu...</div>
        </div>
    );

    const handleShowDetailInvoice = (hoaDonId) => {
        setInvoiceId(hoaDonId);
        setShowModalDetailInvoice(true);
    };
    
    return (
        <>
            <div className='container'>
                <div className='invoice-container'>
                    <div className='invoice-title mt-3'>
                        <h3>Danh sách hóa đơn</h3><hr />
                    </div>
                    {invoices.length === 0 ? (
                        <p>Không có hóa đơn nào.</p>
                    ) : (
                        <Row>
                        {invoices.map((invoice, idx) => (
                            <Col key={idx} md={4} className="mb-3">
                                <Card className="shadow-sm h-100">
                                    <Card.Body>
                                        <Card.Title>Hóa đơn tiền trọ - {invoice.HopDong?.Phong?.tenPhong}</Card.Title>
                                        <div><strong>Ngày tạo:</strong> {formatDateVN(invoice.ngayTao)}</div>
                                        <div><strong>Sinh viên:</strong> {removeVietnameseTones(invoice.HopDong?.NguoiDung?.hoTen)}</div>
                                        <div><strong>Số tiền phải trả:</strong> {Number(invoice.tongTienPhaiTra).toLocaleString('vi-VN')} VNĐ</div>
                                        <div><strong>Số tiền đã trả:</strong> {Number(invoice.soTienDaTra).toLocaleString('vi-VN')} VNĐ</div>
                                        <div><strong>Còn lại:</strong> {Number(invoice.tienDuThangTrc).toLocaleString('vi-VN')} VNĐ</div>
                                        <div className="mt-3 text-end">
                                            <Button
                                                variant="primary"
                                                onClick={() => handleShowDetailInvoice(invoice.id)}
                                            >
                                                <i className="fa fa-info-circle me-1"></i>Xem chi tiết
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        </Row>
                    )}
                </div>
                <div className='booking-container mt-5'>
                    <div className='booking-title'>
                        <h5>Danh sách đặt phòng</h5><hr />
                    </div>

                    {loadingBookings ? (
                        <div className='loading-container'>
                            <Spinner animation="border" className="text-primary" />
                            <div className="mt-2">Đang tải dữ liệu...</div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <p>Không có đặt phòng nào.</p>
                    ) : (
                        <Row>
                        {bookings.map((booking, idx) => (
                            <Col key={idx} md={4} className="mb-3">
                                <Card className="shadow-sm h-100">
                                    <Card.Body>
                                        <Card.Title>Phòng: {booking?.tenPhong}</Card.Title>
                                        <div><strong>Ngày đặt:</strong> {formatDateVN(booking?.createdAt)}</div>
                                        <div><strong>Nhà trọ:</strong> {booking?.tenNha}</div>
                                        <div><strong>Trạng thái:</strong> Chờ xử lý</div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                        </Row>
                    )}
                </div>
            </div>

            <ModalDetailInvoice
                show={showModalDetailInvoice}
                onHide={() => setShowModalDetailInvoice(false)}
                hoaDonId={invoiceId}
            />
        </>
    );
}

export default Invoices;