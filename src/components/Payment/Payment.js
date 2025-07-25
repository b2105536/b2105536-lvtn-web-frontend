import { useContext, useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { UserContext } from "../../context/UserContext";
import { getPaymentInfo, createZaloPayOrder } from '../../services/paymentService';
import { removeVietnameseTones } from '../../utils/invoiceHelper';

const Payment = (props) => {
    const { user, loginContext } = useContext(UserContext);

    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getPaymentInfo(user.account.email);
            if (res && res.EC === 0) {
                setData(res.DT);
            }
        };
        fetchData();
    }, []);

    const handlePayment= async () => {
        try {
            const tongTien = Number(data.giaThue) +
                data.DichVus.reduce((acc, dv) => {
                    const isDienNuoc = dv.tenDV.toLowerCase().includes('điện') || dv.tenDV.toLowerCase().includes('nước');
                    const soLuong = isDienNuoc ? dv.csSauGanNhat - dv.csTrcGanNhat : 1;
                    return acc + soLuong * Number(dv.donGia);
                }, 0);

            const res = await createZaloPayOrder(tongTien, user.account.email, data.hoaDonGanNhat.id);

            if (res && res.EC === 0) {
                const orderUrl = res.DT.order_url;
                window.location.href = orderUrl;
            } else {
                alert(res.data.EM || 'Tạo đơn hàng thất bại');
            }
        } catch (error) {
            console.error('Thanh toán ZaloPay error:', error);
            alert('Có lỗi xảy ra khi thanh toán');
        }
    };


    return (
        <div className='container'>
            <div className='payment-container'>
                <div className='payment-title mt-3'>
                    <h3>Thanh toán</h3><hr />
                </div>
                {data && (
                    <div className='payment-body'>
                        {data.hoaDonGanNhat && data.hoaDonGanNhat.soTienDaTra >= data.hoaDonGanNhat.tongTienPhaiTra ? (
                            <>
                                <h5>Hóa đơn</h5>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>Hóa đơn tháng {new Date(data.ngayGN).getMonth() + 1}/{new Date(data.ngayGN).getFullYear()}</Card.Title>
                                        <Card.Text>
                                            Sinh viên: {removeVietnameseTones(data.hoTen)}<br />
                                            Tổng tiền: {Number(data.hoaDonGanNhat.tongTienPhaiTra)?.toLocaleString('vi-VN')} VNĐ<br />
                                            Đã thanh toán: {Number(data.hoaDonGanNhat.soTienDaTra)?.toLocaleString('vi-VN')} VNĐ<br />
                                            Tiền dư: {Number(data.hoaDonGanNhat.tienDuThangTrc)?.toLocaleString('vi-VN')} VNĐ<br />
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </>
                        ) : (
                            <>
                                <h5>Giấy báo tiền trọ</h5>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>Giấy báo tháng {new Date(data.ngayGN).getMonth() + 1}/{new Date(data.ngayGN).getFullYear()}</Card.Title>
                                        <hr />
                                        
                                        <div>
                                            <span>Sinh viên: {removeVietnameseTones(data.hoTen)}</span><br/>
                                            <span>Giá thuê: {Number(data.giaThue)?.toLocaleString('vi-VN')} VNĐ</span><br/>
                                            <span>Dịch vụ sử dụng:</span>
                                            {data.DichVus.map((dv, idx) => {
                                                const isDienNuoc = dv.tenDV.toLowerCase().includes('điện') || dv.tenDV.toLowerCase().includes('nước');
                                                const soLuong = isDienNuoc ? dv.csSauGanNhat - dv.csTrcGanNhat : 1;
                                                const thanhTien = soLuong * Number(dv.donGia);

                                                return (
                                                    <div key={idx} className='text-muted' style={{ marginLeft: '1rem', marginBottom: '4px' }}>
                                                        {idx + 1}. {dv.tenDV}:{' '}
                                                        {isDienNuoc
                                                            ? `${soLuong} x ${Number(dv.donGia).toLocaleString('vi-VN')} = ${thanhTien.toLocaleString('vi-VN')} VNĐ`
                                                            : `${Number(dv.donGia).toLocaleString('vi-VN')} VNĐ`}
                                                    </div>
                                                );
                                            })}
                                            <hr />
                                            <p>
                                                <strong>
                                                    Tổng tiền phải trả:{' '}
                                                    {(
                                                        Number(data.giaThue) +
                                                        data.DichVus.reduce((acc, dv) => {
                                                            const isDienNuoc = dv.tenDV.toLowerCase().includes('điện') || dv.tenDV.toLowerCase().includes('nước');
                                                            const soLuong = isDienNuoc ? dv.csSauGanNhat - dv.csTrcGanNhat : 1;
                                                            return acc + soLuong * Number(dv.donGia);
                                                        }, 0)
                                                    ).toLocaleString('vi-VN')} VNĐ
                                                </strong>
                                            </p>
                                        </div>

                                        <Button variant="primary" onClick={handlePayment}>Thanh toán với ZaloPay</Button>
                                    </Card.Body>
                                </Card>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Payment;