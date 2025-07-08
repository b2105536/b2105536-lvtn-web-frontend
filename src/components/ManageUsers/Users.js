import { useEffect, useState } from 'react';
import './Users.scss';
import { fetchAllUsers } from '../../services/userService';
import ReactPaginate from 'react-paginate';

const Users = (props) => {
    const [listUsers, setListUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    
    useEffect (() => {
        fetchUsers() ;
    }, [currentPage]);

    const fetchUsers = async () => {
        let response = await fetchAllUsers(currentPage, currentLimit);

        if (response && response.data && response.data.EC === 0) {
            setTotalPages(response.data.DT.totalPages);
            setListUsers(response.data.DT.users);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    return (
        <div className='container'>
            <div className='manage-users-container'>
                <div className='user-header'>
                    <div className='title'>
                        <h3>Bảng Người Dùng</h3>
                    </div>
                    <div className='actions'>
                        <button className='btn btn-success'>Làm mới</button>
                        <button className='btn btn-primary'>Thêm người dùng</button>
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
                                                    <td>{index + 1}</td>
                                                    <td>{item.id}</td>
                                                    <td>{item.soDienThoai}</td>
                                                    <td>{item.hoTen}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.NhomND ? item.NhomND.tenNhom : ''}</td>
                                                    <td>
                                                        <button className='btn btn-warning'>Sửa</button>
                                                        <button className='btn btn-danger'>Xóa</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                :
                                    <><tr><td>Không tìm thấy người dùng.</td></tr></>
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
    );
}

export default Users;