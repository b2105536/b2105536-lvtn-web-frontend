import { useEffect, useState } from 'react';
import './Rooms.scss';
import { deleteRoom, fetchAllRooms, fetchHouse, fetchRoomStatus, fetchRentRange, fetchAreaRange, fetchCapacity } from '../../services/roomService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalDelete from '../ManageUsers/ModalDelete';
import ModalRoom from './ModalRoom';

const Rooms = (props) => {
    const [listHouses, setListHouses] = useState([]);
    const [selectedHouse, setSelectedHouse] = useState('ALL');
    const [listRoomStatuses, setListRoomStatuses] = useState([]);
    const [selectedRoomStatus, setSelectedRoomStatus] = useState('ALL');
    const [listRentRanges, setListRentRanges] = useState([]);
    const [selectedRentRange, setSelectedRentRange] = useState('ALL');
    const [listAreaRanges, setListAreaRanges] = useState([]);
    const [selectedAreaRange, setSelectedAreaRange] = useState('ALL');
    const [listCapacities, setListCapacities] = useState([]);
    const [selectedCapacity, setSelectedCapacity] = useState('ALL');
    const [hasMezzanine, setHasMezzanine] = useState('ALL');

    const [listRooms, setListRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState({});

    const [isShowModalRoom, setIsShowModalRoom] = useState(false);
    const [actionModalRoom, setActionModalRoom] = useState("CREATE");
    const [dataModalRoom, setDataModalRoom] = useState({});

    useEffect(() => {
        fetchInitialFilters();
    }, []);

    const fetchInitialFilters = async () => {
        await Promise.all([
            fetchHouses(),
            fetchRoomStatuses(),
            fetchRentRanges(),
            fetchAreaRanges(),
            fetchCapacities()
        ]);
    };

    const fetchHouses = async () => {
        let res = await fetchHouse();
        if (res && res.EC === 0) {
            setListHouses(res.DT);
        }
    };

    const fetchRoomStatuses = async () => {
        let res = await fetchRoomStatus();
        if (res && res.EC === 0) {
            setListRoomStatuses(res.DT);
        }
    };

    const fetchRentRanges = async () => {
        let res = await fetchRentRange();
        if (res && res.EC === 0) {
            setListRentRanges(res.DT);
        }
    };

    const fetchAreaRanges = async () => {
        let res = await fetchAreaRange();
        if (res && res.EC === 0) {
            setListAreaRanges(res.DT);
        }
    };

    const fetchCapacities = async () => {
        let res = await fetchCapacity();
        if (res && res.EC === 0) {
            setListCapacities(res.DT);
        }
    };

    useEffect (() => {
        fetchRooms();
    }, [currentPage, selectedHouse, selectedRoomStatus, selectedRentRange, selectedAreaRange, selectedCapacity, hasMezzanine]);

    const fetchRooms = async () => {
        let giaThueTu = '', giaThueDen = '', dienTichTu = '', dienTichDen = '';

        if (selectedRentRange && selectedRentRange !== 'ALL') {
            try {
                const parsed = JSON.parse(selectedRentRange);
                giaThueTu = parsed.giaThueTu;
                giaThueDen = parsed.giaThueDen;
            } catch (error) {
                console.error("Lỗi parse khoảng giá:", error);
            }
        }

        if (selectedAreaRange && selectedAreaRange !== 'ALL') {
            try {
                const parsed = JSON.parse(selectedAreaRange);
                dienTichTu = parsed.dienTichTu;
                dienTichDen = parsed.dienTichDen;
            } catch (error) {
                console.error("Lỗi parse khoảng diện tích:", error);
            }
        }

        let response = await fetchAllRooms(
            currentPage,
            currentLimit,
            selectedHouse,
            selectedRoomStatus,
            giaThueTu, giaThueDen,
            dienTichTu, dienTichDen,
            selectedCapacity,
            hasMezzanine
        );
        if (response && response.EC === 0) {
            setTotalPages(response.DT.totalPages);
            setListRooms(response.DT.rooms);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteRoom = async (room) => {
        setDataModal(room);
        setIsShowModalDelete(true);
    }

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModal({});
    }

    const confirmDeleteRoom = async () => {
        let response = await deleteRoom(dataModal);
        
        if (response && response.EC === 0) {
            toast.success(response.EM);
            await fetchRooms();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.EM);
        }
    }

    const onHideModalRoom = async () => {
        setIsShowModalRoom(false);
        setDataModalRoom({});
        await fetchRooms();
    }

    const handleEditRoom = (room) => {
        setActionModalRoom("UPDATE");
        setDataModalRoom(room);
        setIsShowModalRoom(true);
    }

    const handleRefresh = () => {
        setSelectedHouse('ALL');
        setSelectedRoomStatus('ALL');
        setSelectedRentRange('ALL');
        setSelectedAreaRange('ALL');
        setSelectedCapacity('ALL');
        setHasMezzanine('ALL');
        setCurrentPage(1);
    };

    return (
        <>
            <div className='container'>
                <div className='manage-rooms-container'>
                    <div className='room-header'>
                        <div className='title mt-3'>
                            <h3>Danh Sách Phòng Trọ</h3>
                        </div>
                        <div className='actions my-3'>
                            <button className='btn btn-success refresh' onClick={() => handleRefresh()}>
                                    <i className="fa fa-refresh"></i>Làm mới
                            </button>
                            <button className='btn btn-primary'
                                onClick={() => {
                                    setIsShowModalRoom(true);
                                    setActionModalRoom("CREATE")
                                }}>
                                <i className="fa fa-plus-circle"></i>Thêm phòng trọ
                            </button>
                            <div className="filter-row my-3">
                                <div className="row">
                                    <div className="col-md-2">
                                        <select
                                            className="form-select"
                                            value={selectedHouse}
                                            onChange={(e) => setSelectedHouse(e.target.value)}
                                        >
                                            <option value="ALL">Nhà</option>
                                            {listHouses.map((house) => (
                                                <option key={house.id} value={house.id}>{house.ten}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <select
                                            className="form-select"
                                            value={selectedRentRange}
                                            onChange={(e) => setSelectedRentRange(e.target.value)}
                                        >
                                            <option value="ALL">Khoảng giá</option>
                                            {listRentRanges.map((range) => (
                                                <option
                                                    key={range.id}
                                                    value={JSON.stringify({ giaThueTu: range.giaThueTu, giaThueDen: range.giaThueDen })}
                                                >{range.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <select
                                            className="form-select"
                                            value={selectedAreaRange}
                                            onChange={(e) => setSelectedAreaRange(e.target.value)}
                                        >
                                            <option value="ALL">Khoảng diện tích</option>
                                            {listAreaRanges.map((range) => (
                                                <option
                                                    key={range.id}
                                                    value={JSON.stringify({ dienTichTu: range.dienTichTu, dienTichDen: range.dienTichDen })}
                                                >{range.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <select
                                            className="form-select"
                                            value={selectedCapacity}
                                            onChange={(e) => setSelectedCapacity(e.target.value)}
                                        >
                                            <option value="ALL">Sức chứa</option>
                                            {listCapacities.map((c, index) => (
                                                <option key={index} value={c}>{c} người</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <select
                                            className="form-select"
                                            value={hasMezzanine}
                                            onChange={(e) => setHasMezzanine(e.target.value)}
                                        >
                                            <option value="ALL">Gác lửng</option>
                                            <option value="true">Có gác</option>
                                            <option value="false">Không có gác</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <select
                                            className="form-select"
                                            value={selectedRoomStatus}
                                            onChange={(e) => setSelectedRoomStatus(e.target.value)}
                                        >
                                            <option value="ALL">Trạng thái</option>
                                            {listRoomStatuses.map((stat) => (
                                                <option key={stat.id} value={stat.id}>{stat.giaTri}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='room-body'>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">ID</th>
                                    <th scope="col">Tên phòng</th>
                                    <th scope="col">Giá thuê</th>
                                    <th scope="col">Diện tích</th>
                                    <th scope="col">Sức chứa</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Hành động</th>
                                </tr>
                                </thead>
                                <tbody>
                                {listRooms && listRooms.length > 0 ?
                                            <>
                                                {listRooms.map((item, index) => {
                                                    return (
                                                        <tr key={`row-${index}`}>
                                                            <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                                            <td>{item.id}</td>
                                                            <td>{item.tenPhong}</td>
                                                            <td>{Number(item.giaThue)?.toLocaleString('vi-VN')}</td>
                                                            <td>{item.dienTich}</td>
                                                            <td>{item.sucChua}</td>
                                                            <td>{item.BangMa ? item.BangMa.giaTri : ''}</td>
                                                            <td>
                                                                <button className='btn btn-warning mx-3'
                                                                    onClick={() => handleEditRoom(item)}><i className="fa fa-pencil"></i>Sửa</button>
                                                                <button className='btn btn-danger'
                                                                    onClick={() => handleDeleteRoom(item)}><i className="fa fa-trash"></i>Xóa</button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </>
                                        :
                                            <><tr><td colSpan={8}>Không tìm thấy phòng trọ.</td></tr></>
                                    }
                                </tbody>
                        </table>
                    </div>
                    {totalPages > 0 &&
                        <div className='room-footer'>
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
                </div>
            </div>
            <ModalDelete
                show={isShowModalDelete}
                handleClose={handleClose}
                confirmDelete={confirmDeleteRoom}
                dataModal={dataModal}
                title="Xóa phòng trọ"
                content={`Bạn có chắc chắn muốn xóa phòng ${dataModal.tenPhong} hay không?`}
            />
            <ModalRoom 
                onHide={onHideModalRoom}
                show={isShowModalRoom}
                action={actionModalRoom}
                dataModalRoom={dataModalRoom}
            />
        </>
    );
}

export default Rooms;