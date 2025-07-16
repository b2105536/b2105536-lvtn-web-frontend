import { useEffect, useState } from 'react';
import './Houses.scss';
import { fetchAllHouses, deleteHouse } from '../../services/houseService';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import ModalDelete from '../ManageUsers/ModalDelete';
import ModalHouse from './ModalHouse';

const Houses = (props) => {
    const [listHouses, setListHouses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    // Modal Delete
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataModal, setDataModal] = useState({});
    
    // Modal Create/Update
    const [isShowModalHouse, setIsShowModalHouse] = useState(false);
    const [actionModalHouse, setActionModalHouse] = useState("CREATE");
    const [dataModalHouse, setDataModalHouse] = useState({});

    useEffect (() => {
        fetchHouses() ;
    }, [currentPage]);

    const fetchHouses = async () => {
        let response = await fetchAllHouses(currentPage, currentLimit);
        if (response && response.EC === 0) {
            setTotalPages(response.DT.totalPages);
            setListHouses(response.DT.houses);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteHouse = async (house) => {
        setDataModal(house);
        setIsShowModalDelete(true);
    }

    const handleClose = () => {
        setIsShowModalDelete(false);
        setDataModal({});
    }

    const confirmDeleteHouse = async () => {
        let response = await deleteHouse(dataModal);
        
        if (response && response.EC === 0) {
            toast.success(response.EM);
            await fetchHouses();
            setIsShowModalDelete(false);
        } else {
            toast.error(response.EM);
        }
    }

    const onHideModalHouse = async () => {
        setIsShowModalHouse(false);
        setDataModal({});
        await fetchHouses();
    }

    const handleEditHouse = async (house) => {
        setActionModalHouse("UPDATE");
        setDataModalHouse(house);
        setIsShowModalHouse(true);
    }

    const handleRefresh = async () => {
        await fetchHouses();
    }

    return (
        <>
            <div className='container'>
                <div className='manage-houses-container'>
                    <div className='house-header'>
                        <div className='title mt-3'>
                            <h3>Danh Sách Nhà Trọ</h3>
                        </div>
                        <div className='actions my-3'>
                            <button className='btn btn-success refresh' onClick={() => handleRefresh()}>
                                <i className="fa fa-refresh"></i>Làm mới
                            </button>
                            <button className='btn btn-primary'
                                onClick={() => {
                                    setIsShowModalHouse(true);
                                    setActionModalHouse("CREATE");
                                }}
                            ><i className="fa fa-plus-circle"></i>Thêm nhà trọ</button>
                        </div>
                    </div>
                    <div className='house-body'>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                <th scope="col">STT</th>
                                <th scope="col">ID</th>
                                <th scope="col">Tên nhà trọ</th>
                                <th scope="col">Địa chỉ</th>
                                <th scope="col">Mô tả</th>
                                <th scope="col">Người đại diện</th>
                                <th scope="col">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listHouses && listHouses.length > 0 ?
                                        <>
                                            {listHouses.map((item, index) => {
                                                return (
                                                    <tr key={`row-${index}`}>
                                                        <td>{(currentPage - 1) * currentLimit + index + 1}</td>
                                                        <td>{item.id}</td>
                                                        <td>{item.ten}</td>
                                                        <td>{item.diaChi}</td>
                                                        <td>{item.moTa}</td>
                                                        <td>{item.NguoiDung ? item.NguoiDung.hoTen : ''}</td>
                                                        <td>
                                                            <button className='btn btn-warning mx-3'
                                                                    onClick={() => handleEditHouse(item)}><i className="fa fa-pencil"></i>Sửa</button>
                                                            <button className='btn btn-danger'
                                                                    onClick={() => handleDeleteHouse(item)}><i className="fa fa-trash"></i>Xóa</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </>
                                    :
                                        <><tr><td colSpan={7}>Không tìm thấy nhà trọ.</td></tr></>
                                }
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 0 &&
                        <div className='house-footer'>
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
                confirmDelete={confirmDeleteHouse}
                dataModal={dataModal}
                title="Xóa nhà trọ"
                content={`Bạn có chắc chắn muốn xóa "${dataModal.ten}" hay không?`}
            />

            <ModalHouse
                onHide={onHideModalHouse}
                show={isShowModalHouse}
                action={actionModalHouse}
                dataModalHouse={dataModalHouse}
            />
        </>
    );
}

export default Houses;