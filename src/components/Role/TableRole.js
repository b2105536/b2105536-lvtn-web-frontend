import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { fetchAllRoles, deleteRole, updateCurrentRole } from "../../services/roleService";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const TableRole = forwardRef ((props, ref) => {
    const [listRoles, setListRoles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [url, setUrl] = useState('');
    const [quyenHan, setQuyenHan] = useState('');
    
    useEffect (() => {
        getAllRoles() ;
    }, [currentPage]);

    useImperativeHandle (ref, () => ({
        fetchListRolesAgain() {
            getAllRoles();
        }
    }));

    const getAllRoles = async () => {
        let response = await fetchAllRoles(currentPage, currentLimit);
        if (response && +response.EC === 0) {
            setTotalPages(response.DT.totalPages);
            setListRoles(response.DT.roles);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteRole = async (role) => {
        let data = await deleteRole(role);
        if (data && +data.EC === 0) {
            toast.success(data.EM);
            await getAllRoles();
        }
    }

    const handleEditRole = (role) => {
        setSelectedRole(role);
        setUrl(role.url);
        setQuyenHan(role.quyenHan);
        setIsEditing(true);
    }

    const handleSaveRole = async () => {
        if (url && quyenHan) {
            let updatedRole = { ...selectedRole, url, quyenHan };
            console.log(updatedRole)
            let response = await updateCurrentRole(updatedRole);
            if (response && +response.EC === 0) {
                toast.success(response.EM);
                setIsEditing(false);
                setSelectedRole(null);
                await getAllRoles();
            } else {
                toast.error(response.EM);
            }
        } else {
            toast.error("Vui lòng điền đủ thông tin.");
        }
    }

    return (
        <>
        <div className='role-body'>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">URL</th>
                        <th scope="col">Quyền hạn</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>                
                <tbody>
                    {listRoles && listRoles.length > 0 ?
                            <>
                                {listRoles.map((item, index) => {
                                    return (
                                        <tr key={`row-${index}`}>
                                            <td>{item.id}</td>
                                            <td>{item.url}</td>
                                            <td>{item.quyenHan}</td>
                                            <td>
                                                <button className='btn btn-warning mx-3'
                                                        onClick={() => handleEditRole(item)}><i className="fa fa-pencil"></i>Sửa</button>
                                                <button className='btn btn-danger'
                                                        onClick={() => handleDeleteRole(item)}><i className="fa fa-trash"></i>Xóa</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </>
                        :
                            <><tr><td colSpan={4}>Không tìm thấy quyền hạn.</td></tr></>
                    }
                </tbody>
            </table>
        </div>
        {isEditing && (
            <>
                <hr />
                <div className='edit-role-form row mb-3'>
                    <h4>Chỉnh sửa quyền hạn:</h4>
                    <div className='col-5 form-group'>
                        <label><span className='red'>*</span>URL:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={url}
                            onChange={(event) => setUrl(event.target.value)}
                        />
                    </div>
                    <div className='col-5 form-group'>
                        <label><span className='red'>*</span>Quyền hạn:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={quyenHan}
                            onChange={(event) => setQuyenHan(event.target.value)}
                        />
                    </div>
                    <div className='col-2 mt-4 actions'>
                        <i className="fa fa-floppy-o save" title="Lưu" onClick={handleSaveRole}></i>
                        <i className="fa fa-undo cancel" title="Hủy" onClick={() => setIsEditing(false)}></i>
                    </div>
                </div>
            </>   
        )}

        {totalPages > 0 &&
            <div className='role-footer'>
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
    );
})

export default TableRole;