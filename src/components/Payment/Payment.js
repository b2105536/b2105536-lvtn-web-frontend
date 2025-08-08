import { useContext, useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { UserContext } from "../../context/UserContext";
import { getPaymentInfo, createZaloPayOrder } from '../../services/paymentService';
import { removeVietnameseTones } from '../../utils/invoiceHelper';

const Payment = (props) => {
    const { user } = useContext(UserContext);

    const [data, setData] = useState(null);
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getPaymentInfo(user.account.email);
            if (res && res.EC === 0) {
                setData(res.DT);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='container'>
            <div className='payment-container'>
                <div className='payment-title mt-3'>
                    <h3>Thanh toán</h3><hr />
                </div>
                {data?.danhSachGiayBao?.length > 0 ? (
                    <div className='payment-body'>
                        <div className='row g-4'>
                            {data.danhSachGiayBao.map((item, index) => {
                                const isPaid = item.hoaDonGanNhat?.soTienDaTra >= item.hoaDonGanNhat?.tongTienPhaiTra;
                                const thang = new Date(item.ngayGN).getMonth() + 1;
                                const nam = new Date(item.ngayGN).getFullYear();

                                const tongTien = Number(item.giaThue) +
                                    item.DichVus.reduce((acc, dv) => {
                                        const isDienNuoc = dv.tenDV.toLowerCase().includes('điện') || dv.tenDV.toLowerCase().includes('nước');
                                        const soLuong = isDienNuoc ? dv.csSauGanNhat - dv.csTrcGanNhat : 1;
                                        return acc + soLuong * Number(dv.donGia);
                                    }, 0);

                                const handlePayment= async (hoaDonId) => {
                                    setLoadingId(hoaDonId);
                                    try {
                                        const res = await createZaloPayOrder(tongTien, user.account.email, hoaDonId);
                                        if (res && res.EC === 0) {
                                            const orderUrl = res.DT.order_url;
                                            window.location.href = orderUrl;
                                        } else {
                                            alert(res.EM || 'Tạo đơn hàng thất bại');
                                        }
                                    } catch (error) {
                                        console.error('Thanh toán ZaloPay error:', error);
                                        alert('Có lỗi xảy ra khi thanh toán');
                                    } finally {
                                        setLoadingId(false);
                                    }
                                }

                                return (
                                    <div className="col-md-6" key={index}>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>
                                                    {isPaid ? 'Hóa đơn vừa thanh toán' : 'Giấy báo tiền trọ'} - Phòng: {item.tenPhong}
                                                </Card.Title>
                                                <div className='text-muted mb-2'>
                                                    Tháng {thang}/{nam} - Sinh viên: {removeVietnameseTones(data.hoTen)}
                                                </div>
                                                {isPaid ? (
                                                    <Card.Text>
                                                        Tổng tiền: {Number(item.hoaDonGanNhat.tongTienPhaiTra)?.toLocaleString('vi-VN')} VNĐ<br />
                                                        Đã thanh toán: {Number(item.hoaDonGanNhat.soTienDaTra)?.toLocaleString('vi-VN')} VNĐ<br />
                                                        Tiền dư: {Number(item.hoaDonGanNhat.tienDuThangTrc)?.toLocaleString('vi-VN')} VNĐ<br />
                                                    </Card.Text>
                                                ) : (
                                                    <>
                                                        {item.DichVus.length === 0 ? (
                                                            <div className="text-danger fw-bold">
                                                                Giấy báo chính thức chưa được lập - không thể thanh toán.
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <div>
                                                                    <span>Giá thuê: {Number(item.giaThue)?.toLocaleString('vi-VN')} VNĐ</span><br />
                                                                    <span>Dịch vụ sử dụng:</span>
                                                                    {item.DichVus.map((dv, idx) => {
                                                                        const isDienNuoc = dv.tenDV.toLowerCase().includes('điện') || dv.tenDV.toLowerCase().includes('nước');
                                                                        const soLuong = isDienNuoc ? dv.csSauGanNhat - dv.csTrcGanNhat : 1;
                                                                        const thanhTien = soLuong * Number(dv.donGia);

                                                                        return (
                                                                            <div key={idx} className='text-muted' style={{ marginLeft: '1rem' }}>
                                                                                {idx + 1}. {dv.tenDV}: {isDienNuoc
                                                                                    ? `${soLuong} x ${Number(dv.donGia).toLocaleString('vi-VN')} = ${thanhTien.toLocaleString('vi-VN')} VNĐ`
                                                                                    : `${Number(dv.donGia).toLocaleString('vi-VN')} VNĐ`}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    <hr />
                                                                    <strong>Tổng tiền phải trả: {tongTien.toLocaleString('vi-VN')} VNĐ</strong><br />
                                                                </div>
                                                                <Button className="mt-3" variant="primary"
                                                                    disabled={loadingId === item.hoaDonGanNhat.id}
                                                                    onClick={() => handlePayment(item.hoaDonGanNhat.id)}
                                                                >
                                                                    {loadingId === item.hoaDonGanNhat.id ? 'Đang xử lý...' : 'Thanh toán với ZaloPay'}
                                                                </Button>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p>Không tìm thấy giấy báo hoặc hóa đơn nào.</p>
                )}
            </div>
        </div>
    );
}

export default Payment;