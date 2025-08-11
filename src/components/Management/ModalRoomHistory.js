import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fetchRoomHistory } from '../../services/managementService';
import { toast } from 'react-toastify';
import { formatDateVN } from '../../utils/invoiceHelper';

const ModalRoomHistory = (props) => {
    const { show, handleClose, roomId } = props;

    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (show && roomId) {
            loadHistory();
        }
    }, [show, roomId]);

    const loadHistory = async () => {
        let res = await fetchRoomHistory(roomId);
        if (res && res.EC === 0) {
            setHistory(res.DT);
        } else {
            toast.error(res.EM || "Không tải được lịch sử thuê");
        }
    }

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Lịch sử thuê phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {history.length > 0 ? (
                    <table className="table table-bordered">
                        <thead>
                            <tr className="text-center">
                                <th>STT</th>
                                <th>Họ tên</th>
                                <th>Bắt đầu thuê</th>
                                <th>Kết thúc thuê</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.sinhVien.hoTen}</td>
                                    <td>{item.ngayBD ? formatDateVN(item.ngayBD) : ''}</td>
                                    <td>{item.ngayKT ? formatDateVN(item.ngayKT) : ''}</td>
                                    <td className="text-center">
                                        {Number(item.ttHopDongId) === 8 && (
                                            <span className="text-success">
                                                <i className="fa fa-check-square"></i> Đang thuê
                                            </span>
                                        )}
                                        {Number(item.ttHopDongId) === 9 && (
                                            <span className="text-warning">
                                                <i className="fa fa-plus-square"></i> Cần gia hạn
                                            </span>
                                        )}
                                        {Number(item.ttHopDongId) === 10 && (
                                            <span className="text-danger">
                                                <i className="fa fa-minus-square"></i> Dừng thuê
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Không có lịch sử thuê phòng</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalRoomHistory;