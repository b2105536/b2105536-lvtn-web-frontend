import { useEffect, useState } from 'react';
import './Rooms.scss';
import { deleteRoom, fetchAllRooms } from '../../services/roomService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalDelete from '../ManageUsers/ModalDelete';
import ModalRoom from './ModalRoom';

const Rooms = (props) => {
    const [listRooms, setListRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState({});

    const [isShowModalRoom, setIsShowModalRoom] = useState(false);
    const [actionModalRoom, setActionModalRoom] = useState("CREATE");
    const [dataModalRoom, setDataModalRoom] = useState({});

    useEffect (() => {
        fetchRooms();
    }, [currentPage]);

    const fetchRooms = async () => {
        let response = await fetchAllRooms(currentPage, currentLimit);
        if (response && response.EC === 0) {
            setTotalPages(response.DT.totalPages);
            setListRooms(response.DT.rooms);
        }
    }

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

    return (
        <>
            <div className='container'>
                <div className='manage-rooms-container'>
                    <div className='room-header'>
                        <div className='title mt-3'>
                            <h3>Danh Sách Phòng Trọ</h3>
                        </div>
                        <div className='actions my-3'>
                            <button className='btn btn-success refresh'>
                                    <i className="fa fa-refresh"></i>Làm mới
                            </button>
                            <button className='btn btn-primary'
                                onClick={() => {
                                    setIsShowModalRoom(true);
                                    setActionModalRoom("CREATE")
                                }}>
                                <i className="fa fa-plus-circle"></i>Thêm phòng trọ
                            </button>
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