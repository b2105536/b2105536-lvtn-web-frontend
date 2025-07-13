import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { fetchAllRoles, deleteRole } from "../../services/roleService";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const TableRole = forwardRef ((props, ref) => {
    const [listRoles, setListRoles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    
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