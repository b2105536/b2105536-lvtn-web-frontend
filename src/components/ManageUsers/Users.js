import { useEffect, useState } from 'react';
import './Users.scss';
import { fetchAllUsers, deleteUser, fetchGroup } from '../../services/userService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalDelete from './ModalDelete';
import ModalUser from './ModalUser';

const Users = (props) => {
    const [listGroups, setListGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('ALL');

    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    // Modal Delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState({});
    
    // Modal Create/Update
    const [isShowModalUser, setIsShowModalUser] = useState(false);
    const [actionModalUser, setActionModalUser] = useState("CREATE");
    const [dataModalUser, setDataModalUser] = useState({});

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        let res = await fetchGroup();
        if (res && res.EC === 0) {
            setListGroups(res.DT);
        }
    };

    useEffect (() => {
        fetchUsers() ;
    }, [currentPage, selectedGroup]);

    const fetchUsers = async () => {
        let response = await fetchAllUsers(currentPage, currentLimit, selectedGroup);
        if (response && response.EC === 0) {
            setTotalPages(response.DT.totalPages);
            setListUsers(response.DT.users);
        }
    };

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteUser = async (user) => {
        setDataModal(user);
        setIsShowModalDelete(true);
    }

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModal({});
    }

    const confirmDeleteUser = async () => {
        let response = await deleteUser(dataModal);
        
        if (response && response.EC === 0) {
            toast.success(response.EM);
            await fetchUsers();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.EM);
        }
    }

    const onHideModalUser = async () => {
        setIsShowModalUser(false);
        setDataModal({});
        await fetchUsers();
    }

    const handleEditUser = async (user) => {
        setActionModalUser("UPDATE");
        setDataModalUser(user);
        setIsShowModalUser(true);
    }

    const handleRefresh = async () => {
        setSelectedGroup('ALL');
        setCurrentPage(1);
    }

    return (
        <>
            <div className='container'>
                <div className='manage-users-container'>
                    <div className='user-header'>
                        <div className='title mt-3'>
                            <h3>Danh Sách Người Dùng</h3>
                        </div>
                        <div className='actions my-3'>
                            <button className='btn btn-success refresh' onClick={() => handleRefresh()}>
                                <i className="fa fa-refresh"></i>Làm mới
                            </button>
                            <button className='btn btn-primary'
                                onClick={() => {
                                    setIsShowModalUser(true);
                                    setActionModalUser("CREATE");
                                }}
                            ><i className="fa fa-plus-circle"></i>Thêm người dùng
                            </button>
                            <div className="filter-row my-3">
                                <div className="row">
                                    <div className="col-md-3">
                                        <select
                                            className="form-select"
                                            value={selectedGroup}
                                            onChange={(e) => setSelectedGroup(e.target.value)}
                                        >
                                            <option value="ALL">Tất cả nhóm</option>
                                            {listGroups.map((group) => (
                                                <option key={group.id} value={group.id}>{group.tenNhom}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='user-body'>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                <th scope="col">STT</th>
                                <th scope="col">ID</th>
                                <th scope="col">Số điện thoại</th>
                                <th scope="col">Họ tên</th>
                                <th scope="col">Email</th>
                                <th scope="col">Nhóm người dùng</th>
                                <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listUsers && listUsers.length > 0 ?
                                        <>
                                            {listUsers.map((item, index) => {
                                                return (
                                                    <tr key={`row-${index}`}>
                                                        <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.soDienThoai}</td>
                                                        <td>{item.hoTen}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.NhomND ? item.NhomND.tenNhom : ''}</td>
                                                        <td>
                                                            <button className='btn btn-warning mx-3'
                                                                    onClick={() => handleEditUser(item)}><i className="fa fa-pencil"></i>Sửa</button>
                                                            <button className='btn btn-danger'
                                                                    onClick={() => handleDeleteUser(item)}><i className="fa fa-trash"></i>Xóa</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    :
                                        <><tr><td colSpan={7}>Không tìm thấy người dùng.</td></tr></>
                                }
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 0 &&
                        <div className='user-footer'>
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
                confirmDelete={confirmDeleteUser}
                dataModal={dataModal}
                title="Xóa người dùng"
                content={`Bạn có chắc chắn muốn xóa người dùng ${dataModal.email} hay không?`}
            />

            <ModalUser
                onHide={onHideModalUser}
                show={isShowModalUser}
                action={actionModalUser}
                dataModalUser={dataModalUser}
            />
        </>
    );
}

export default Users;