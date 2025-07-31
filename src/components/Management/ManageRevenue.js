import { useContext, useState, useEffect } from "react";
import './ManageRevenue.scss';
import { UserContext } from "../../context/UserContext";
import { fetchHousesByOwner, fetchListInvoices } from "../../services/managementService";
import { Card, Button, Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";
import { formatDateVN, removeVietnameseTones } from "../../utils/invoiceHelper";
import ModalDetailInvoice from "../Invoice/ModalDetailInvoice";
import ReactPaginate from 'react-paginate';

const ManageRevenue = (props) => {
    const { user } = useContext(UserContext);

    const [houses, setHouses] = useState([]);
    const [selectedHouseId, setSelectedHouseId] = useState('');

    const [listInvoices, setListInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [invoiceId, setInvoiceId] = useState(null);
    const [showModalDetailInvoice, setShowModalDetailInvoice] = useState(false);

    useEffect (() => {
        getHouses();
    }, []);

    useEffect (() => {
        if (selectedHouseId) {
            getListInvoices(selectedHouseId);
        } else {
            setListInvoices([]);
        }
    }, [currentPage, selectedHouseId]);

    const getHouses = async () => {
        let res = await fetchHousesByOwner(user.account.email);
        if (res && res.EC === 0) {
            setHouses(res.DT);
        } else {
            toast.error(res.EM);
        }
    }

    const getListInvoices = async (houseId) => {
        let res = await fetchListInvoices(houseId, currentPage, currentLimit);
        if (res && res.EC === 0) {
            setTotalPages(res.DT.totalPages);
            setListInvoices(res.DT.invoices);
        } else {
            toast.error(res.EC);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    }

    const handleOnChangeHouse = (selectedId) => {
        setSelectedHouseId(selectedId);
        setCurrentPage(1);
    }

    const handleShowDetailInvoice = (hoaDonId) => {
        setInvoiceId(hoaDonId);
        setShowModalDetailInvoice(true);
    }

    return (
        <>
            <div className="container">
                <div className="manage-revenue-container mt-3">
                    <div className="revenue-header">
                        <div className="title">
                            <h3>Quản lý doanh thu</h3>
                        </div>
                        <div className="actions">
                            <div className='col-12 col-sm-6 form-group'>
                                <label>Nhà trọ sở hữu (<span className='red'>*</span>):</label>
                                <select className='form-select'
                                    value={selectedHouseId}
                                    onChange={(event) => handleOnChangeHouse(event.target.value)}
                                >
                                    <option value="">-- Chọn nhà trọ --</option>
                                    {houses.length > 0 &&
                                        houses.map((item, index) => {
                                            return (
                                                <option key={`house-${index}`} value={item.id}>{item.ten}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <hr />
                    </div>
                    <div className="revenue-body">
                        <div className="sub-title">
                            <h5>Danh sách hóa đơn</h5>
                        </div>
                        <div className="list-invoices">
                            {listInvoices.length === 0 ? (
                                <p>Không có hóa đơn nào.</p>
                            ) : (
                                <>
                                    <Row>
                                    {listInvoices.map((invoice, idx) => (
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

                                    {totalPages > 0 &&
                                        <div className='list-invoices-footer'>
                                            <ReactPaginate
                                                nextLabel="sau >"
                                                onPageChange={handlePageClick}
                                                pageRangeDisplayed={3}
                                                marginPagesDisplayed={2}
                                                pageCount={totalPages}
                                                previousLabel="< trước"
                                                pageClassName="page-item"
                                                pageLinkClassName="page-link"
                                                previousClassName="page-item"
                                                previousLinkClassName="page-link"
                                                nextClassName="page-item"
                                                nextLinkClassName="page-link"
                                                breakLabel="..."
                                                breakClassName="page-item"
                                                breakLinkClassName="page-link"
                                                containerClassName="pagination"
                                                activeClassName="active"
                                                renderOnZeroPageCount={null}
                                            />
                                        </div>
                                    }
                                </>
                            )}
                        </div>
                        <hr />
                    </div>
                    <div className="revenue-footer">
                        <div className="sub-title">
                            <h5>Phân tích doanh thu</h5>
                        </div>
                        <div className="revenue-chart">

                        </div>
                    </div>
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

export default ManageRevenue;