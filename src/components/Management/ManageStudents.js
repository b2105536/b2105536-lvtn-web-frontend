import { useContext, useEffect, useState } from 'react';
import './ManageStudents.scss';
import { toast } from 'react-toastify';
import { fetchHousesByOwner, fetchRoom, deleteContract } from '../../services/managementService';
import { UserContext } from "../../context/UserContext";
import ModalStudent from './ModalStudent';
import ModalDelete from '../ManageUsers/ModalDelete';

const ManageStudents = (props) => {
    const { user, loginContext } = useContext(UserContext);

    const [houses, setHouses] = useState([]);
    const [listRooms, setListRooms] = useState([]);
    const [selectedHouseId, setSelectedHouseId] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [selectedRent, setSelectedRent] = useState(null);

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
                                        <span className="nav-link active">Danh sách phòng</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="card-body">
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
                                                <button className="btn btn-warning px-4 py-2">Sửa</button>
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