import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import { fetchAllInvoices, fetchAllBookings, deleteBooking, fetchAllContracts } from "../../services/paymentService";
import { Card, Button, Spinner, Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";
import { formatDateVN, removeVietnameseTones } from '../../utils/invoiceHelper';
import ModalDetailInvoice from "./ModalDetailInvoice";
import ModalDelete from "../ManageUsers/ModalDelete";

const Invoices = (props) => {
    const { user } = useContext(UserContext);

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const [contracts, setContracts] = useState([]);
    const [loadingContracts, setLoadingContracts] = useState(true);

    const [invoiceId, setInvoiceId] = useState(null);
    const [showModalDetailInvoice, setShowModalDetailInvoice] = useState(false);

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);

    useEffect(() => {
        getInvoices();
        getBookings();
        getContracts();
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

    const getContracts = async () => {
        let res = await fetchAllContracts(user.account.email);
        if (res && res.EC === 0) {
            setContracts(res.DT);
            setLoadingContracts(false);
        } else {
            toast.error(res.EM || "Lấy hợp đồng thất bại!");
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

    const handleShowDeleteBooking = (bookingId) => {
        setBookingToDelete(bookingId);
        setShowModalDelete(true);
    };

    const confirmDeleteBooking = async () => {
        let res = await deleteBooking(bookingToDelete, user.account.email);
        if (res && res.EC === 0) {
            toast.success(res.EM);
            getBookings();
        } else {
            toast.error(res.EM || "Xóa thất bại!");
        }
        setShowModalDelete(false);
        setBookingToDelete(null);
    }

    const daysRemaining = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const diff = end - now;
        return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
    }
    
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
                        {bookings.map((booking, idx) => {
                            const isSuccess = /done\s*-?/i.test(booking?.dienGiai || "");
                            return (
                                <Col key={idx} md={4} className="mb-3">
                                    <Card className="shadow-sm h-100 position-relative">
                                        <Card.Body>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                className="position-absolute top-0 end-0 m-2"
                                                onClick={() => handleShowDeleteBooking(booking.id)}
                                                title="Xóa đặt phòng"
                                                disabled={isSuccess}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </Button>
                                            <Card.Title>Phòng: {booking?.tenPhong}</Card.Title>
                                            <div><strong>Ngày đặt:</strong> {formatDateVN(booking?.createdAt)}</div>
                                            <div><strong>Nhà trọ:</strong> {booking?.tenNha}</div>
                                            <div><strong>Tên phòng:</strong> {booking?.tenPhong}</div>
                                            <div><strong>Thông tin liên hệ:</strong></div>
                                            <div>&emsp;{booking?.hoTenChuTro} - {booking?.soDienThoaiChuTro}</div>
                                            <div>
                                                <strong>Trạng thái:</strong>{" "}
                                                <span className={isSuccess ? "text-success" : "text-warning"}>
                                                    {isSuccess ? "Thành công" : "Chờ xử lý"}
                                                </span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                        </Row>
                    )}
                </div>
                <div className='contract-container mt-3'>
                    <div className='contract-title'>
                        <h5>Danh sách hợp đồng</h5><hr />
                    </div>

                    {loadingContracts ? (
                        <div className='loading-container'>
                            <Spinner animation="border" className="text-primary" />
                            <div className="mt-2">Đang tải dữ liệu...</div>
                        </div>
                    ) : contracts.length === 0 ? (
                        <p>Không có hợp đồng nào.</p>
                    ) : (
                        <Row>
                        {contracts.map((contract, idx) => (
                            <Col key={idx} md={4} className="mb-3">
                                <Card className="shadow-sm h-100">
                                    <Card.Body>
                                        <Card.Title>Hợp đồng #{contract.id}</Card.Title>
                                        <div><strong>Ngày lập:</strong> {formatDateVN(contract.ngayLap)}</div>
                                        <div><strong>Ngày bắt đầu:</strong> {formatDateVN(contract.ngayBD)}</div>
                                        <div><strong>Ngày kết thúc:</strong> {formatDateVN(contract.ngayKT)}</div>
                                        <div><strong>Nhà trọ:</strong> {contract?.Phong?.Nha?.ten}</div>
                                        <div><strong>Phòng:</strong> {contract?.Phong?.tenPhong}</div>
                                        <div><strong>Thời hạn còn lại:</strong> {daysRemaining(contract.ngayKT)} ngày</div>
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

            <ModalDelete
                show={showModalDelete}
                handleClose={() => setShowModalDelete(false)}
                confirmDelete={confirmDeleteBooking}
                title="Xóa yêu cầu đặt phòng"
                content="Bạn có chắc chắn muốn xóa đặt phòng này không?"
            />
        </>
    );
}

export default Invoices;