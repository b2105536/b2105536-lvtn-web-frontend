import { useContext, useEffect, useState } from 'react';
import './ManageStudents.scss';
import { toast } from 'react-toastify';
import { fetchHousesByOwner, fetchRoom, deleteContract } from '../../services/managementService';
import { UserContext } from "../../context/UserContext";
import ModalStudent from './ModalStudent';
import ModalDelete from '../ManageUsers/ModalDelete';
import ModalService from './ModalService';
import ModalInvoice from './ModalInvoice';
import ModalShowInvoice from './ModalShowInvoice';

const ManageStudents = (props) => {
    const { user, loginContext } = useContext(UserContext);

    const [activeTab, setActiveTab] = useState('rooms');

    const [houses, setHouses] = useState([]);
    const [listRooms, setListRooms] = useState([]);
    const [selectedHouseId, setSelectedHouseId] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedRent, setSelectedRent] = useState(null);

    // Modal Service
    const [showModalService, setShowModalService] = useState(false);

    // Modal Invoice
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceHopDongId, setInvoiceHopDongId] = useState(null);

    // Modal Show Invoice
    const [showModalShowInvoice, setShowModalShowInvoice] = useState(false);

    // Modal Delete
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [selectedContractId, setSelectedContractId] = useState(null);
    const [selectedDeleteRoomId, setSelectedDeleteRoomId] = useState(null);

    useEffect (() => {
        getHouses();
        getAllRooms();
    }, []);
    
    const getHouses = async () => {
        let res = await fetchHousesByOwner(user.account.email);
        if (res && res.EC === 0) {
            setHouses(res.DT);
        } else {
            toast.error(res.EM);
        }
    }
    
    const getAllRooms = async (nhaId) => {
        let res = await fetchRoom(nhaId);
        if (res && +res.EC === 0) {
            setListRooms(res.DT);
        } else {
            toast.error(res.EM);
        }
    }

    const handleOnChangeHouse = async (selectedId) => {
        setSelectedHouseId(selectedId);
        if (selectedId) {
            await getAllRooms(selectedId);
        } else {
            setListRooms([]);
        }
        setSelectedRoomId(null);
        setSelectedRent(null);
        setSelectedContractId(null);
        setSelectedDeleteRoomId(null);
    }

    const handleDeleteContract = async () => {
        try {
            setIsDeleting(true);
            let res = await deleteContract(selectedContractId, selectedDeleteRoomId);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                await getAllRooms(selectedHouseId);
            } else {
                toast.error(res.EM);
            }
        } catch (e) {
            toast.error("Có lỗi xảy ra khi xóa hợp đồng!");
            console.log(e);
        } finally {
            setIsDeleting(false);
            setShowModalDelete(false);
            setSelectedContractId(null);
            setSelectedDeleteRoomId(null);
        }
    };

    const handleShowInvoice = (hopDongId) => {
        setInvoiceHopDongId(hopDongId);
        setShowInvoiceModal(true);
    };

    const handleShowInvoiceDetail = (hopDongId) => {
        setInvoiceHopDongId(hopDongId);
        setShowModalShowInvoice(true);
    };

    return (
        <>
            <div className="container">
                <div className="manage-students-container">
                    <div className="manage-header">
                        <div className='title mt-3'>
                            <h3>Quản lý chung</h3>
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
                            <hr />
                        </div>
                    </div>
                    <div className="manage-body mt-3">
                        <div className="card text-center mt-4">
                            <div className="card-header">
                                <ul className="nav nav-tabs card-header-tabs">
                                    <li className="nav-item">
                                        <span
                                            className={`nav-link ${activeTab === 'rooms' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('rooms')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Danh sách phòng
                                        </span>
                                    </li>
                                    <li className="nav-item">
                                        <span
                                            className={`nav-link ${activeTab === 'payments' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('payments')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Thanh toán
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="card-body">
                                {activeTab === 'rooms' && (
                                    <div className="row">
                                    {listRooms.length > 0 ? (
                                        listRooms.map((room, index) => (
                                        <div className="col-md-6 col-lg-4 mb-4" key={index}>
                                            <div className="card h-100 shadow-sm">
                                            <div className="card-header bg-primary text-white">
                                                <strong>{room.tenPhong}</strong>
                                            </div>
                                            <div className="card-body d-flex flex-column">
                                                <button className="btn btn-outline-success mb-2"
                                                    onClick={() => {
                                                        setSelectedRoomId(room.id);
                                                        setSelectedRent(room.giaThue);
                                                        setShowModal(true);
                                                    }}
                                                    disabled={room.daChoThue}
                                                >
                                                    {room.daChoThue ? "Đã cho thuê" : "Thêm khách"}
                                                </button>

                                                <div className="mb-2 d-flex align-items-center">
                                                    <i className="fa fa-user-circle-o me-2"></i>
                                                    <span>
                                                        {room.daChoThue
                                                        ? `${room.sinhVienThue?.hoTen || 'Không rõ'}`
                                                        : "Chưa có người thuê"}
                                                    </span>
                                                </div>

                                                <div className="mb-3 d-flex align-items-center">
                                                    <i className="fa fa-money me-2"></i>
                                                    <span>{Number(room.giaThue)?.toLocaleString('vi-VN')} VNĐ</span>
                                                </div>

                                                <div className="mt-auto d-flex justify-content-center gap-3">
                                                    <button className="btn btn-info px-4 py-2"
                                                        disabled={!room.daChoThue || !room.hopDongId}
                                                        onClick={() => {
                                                            setSelectedContractId(room.hopDongId);
                                                            setShowModalService(true);
                                                        }}
                                                    >
                                                        Gán
                                                    </button>
                                                    <button className="btn btn-light px-4 py-2"
                                                        disabled={!room.daChoThue || !room.hopDongId}
                                                        onClick={() => handleShowInvoice(room.hopDongId)}
                                                    >
                                                        Báo giá
                                                    </button>
                                                    <button className="btn btn-danger px-4 py-2"
                                                        disabled={!room.daChoThue || !room.hopDongId}
                                                        onClick={() => {
                                                            setSelectedContractId(room.hopDongId);
                                                            setSelectedDeleteRoomId(room.id);
                                                            setShowModalDelete(true);
                                                        }}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        ))
                                    ) : (
                                        <div className="col-12">
                                            <p>Không có phòng nào để hiển thị.</p>
                                        </div>
                                    )}
                                    </div>
                                )}

                                {activeTab === 'payments' && (
                                    <div className="row">
                                        {listRooms.length > 0 ? (
                                            listRooms
                                                .filter(room => room.daChoThue && room.hopDongId)
                                                .map((room, index) => (
                                                    <div className="col-md-6 col-lg-4 mb-4" key={index}>
                                                        <div className="card h-100 shadow-sm">
                                                            <div className="card-header bg-secondary text-white">
                                                                <strong>{room.tenPhong}</strong>
                                                            </div>
                                                            <div className="card-body d-flex flex-column">
                                                                <div className="mb-2 d-flex align-items-center">
                                                                    <i className="fa fa-user-circle-o me-2"></i>
                                                                    <span>{room.sinhVienThue?.hoTen || 'Không rõ'}</span>
                                                                </div>

                                                                <div className="mb-3 d-flex align-items-center">
                                                                    <i className="fa fa-money me-2"></i>
                                                                    <span>{Number(room.giaThue)?.toLocaleString('vi-VN')} VNĐ</span>
                                                                </div>

                                                                <div className="mt-auto d-flex justify-content-center gap-3">
                                                                    <button className="btn btn-outline-primary px-4 py-2"
                                                                        onClick={() => handleShowInvoiceDetail(room.hopDongId)}
                                                                    >
                                                                        Xem giấy báo
                                                                    </button>
                                                                    <button className="btn btn-success px-4 py-2"
                                                                        onClick={() => {
                                                                            // TODO: xử lý xác nhận thanh toán
                                                                            toast.info("Chức năng xác nhận đang phát triển!");
                                                                        }}
                                                                    >
                                                                        Xác nhận
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                        ) : (
                                            <div className="col-12">
                                                <p>Không có thông tin thanh toán.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="manage-footer">
                        
                    </div>
                </div>
            </div>
            <ModalStudent
                show={showModal}
                onHide={() => setShowModal(false)}
                roomId={selectedRoomId}
                rent={selectedRent}
                user={user}
                refreshRooms={() => getAllRooms(selectedHouseId)}
            />

            {showModalService && selectedContractId &&
                <ModalService
                    show={showModalService}
                    handleClose={() => setShowModalService(false)}
                    contractId={selectedContractId}
                />
            }

            <ModalInvoice
                show={showInvoiceModal}
                onHide={() => setShowInvoiceModal(false)}
                hopDongId={invoiceHopDongId}
            />

            <ModalShowInvoice
                show={showModalShowInvoice}
                onHide={() => setShowModalShowInvoice(false)}
                hopDongId={invoiceHopDongId}
            />

            <ModalDelete
                show={showModalDelete}
                disabled={isDeleting}
                handleClose={() => setShowModalDelete(false)}
                confirmDelete={handleDeleteContract}
                title="Xóa hợp đồng"
                content={`Bạn có chắc chắn muốn xóa hợp đồng thuê của sinh viên "${
                    listRooms.find(r => r.id === selectedDeleteRoomId)?.sinhVienThue?.hoTen || '(không rõ tên)'}" hay không?`}
            />
        </>
    );
}

export default ManageStudents;