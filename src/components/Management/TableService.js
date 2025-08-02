import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { fetchAllServices, deleteService, updateCurrentService } from "../../services/managementService";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const TableService = forwardRef ((props, ref) => {
    const [listServices, setListServices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(3);
    const [totalPages, setTotalPages] = useState(0);
    
    const [isEditing, setIsEditing] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [tenDV, setServiceName] = useState('');
    const [donViTinh, setUnit] = useState('');
    const [donGia, setPrice] = useState('');
    const [ghiChuDV, setNote] = useState('');

    useEffect (() => {
        getAllServices() ;
    }, [currentPage]);

    useImperativeHandle (ref, () => ({
        fetchListServicesAgain() {
            getAllServices();
        }
    }));

    const getAllServices = async () => {
        let response = await fetchAllServices(currentPage, currentLimit);
        if (response && +response.EC === 0) {
            setTotalPages(response.DT.totalPages);
            setListServices(response.DT.services);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteService = async (service) => {
        let data = await deleteService(service);
        if (data && +data.EC === 0) {
            toast.success(data.EM);
            await getAllServices();
        } else {
            toast.error(data.EM);
        }
    }

    const handleEditService = (service) => {
        setSelectedService(service);
        setServiceName(service.tenDV);
        setUnit(service.donViTinh);
        setNote(service.ghiChuDV);
        setPrice(service.GiaDichVus?.[0]?.donGia || '');
        setIsEditing(true);
    }

    const handleSaveService = async () => {
        if (tenDV && donViTinh && ghiChuDV) {
            let updatedService = {
                ...selectedService,
                tenDV,
                donViTinh, 
                ghiChuDV,
                donGia };
            let response = await updateCurrentService(updatedService);
            if (response && +response.EC === 0) {
                toast.success(response.EM);
                setIsEditing(false);
                setSelectedService(null);
                await getAllServices();
            } else {
                toast.error(response.EM);
            }
        } else {
            toast.error("Vui lòng điền đủ thông tin.");
        }
    }

    return (
        <>
        <div className='service-body'>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Tên dịch vụ</th>
                        <th scope="col">Đơn vị tính</th>
                        <th scope="col">Đơn giá</th>
                        <th scope="col">Thời điểm</th>
                        <th scope="col">Ghi chú</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>                
                <tbody>
                    {listServices && listServices.length > 0 ?
                            <>
                                {listServices.map((item, index) => {
                                    return (
                                        <tr key={`row-${index}`}>
                                            <td>{item.id}</td>
                                            <td>{item.tenDV}</td>
                                            <td>{item.donViTinh}</td>
                                            <td>{Number(item.GiaDichVus?.[0]?.donGia)?.toLocaleString('vi-VN') || '—'}</td>
                                            <td>{item.GiaDichVus?.[0]?.thoiDiem ? new Date(item.GiaDichVus[0].thoiDiem).toLocaleDateString() : '—'}</td>
                                            <td>{item.ghiChuDV}</td>
                                            <td>
                                                <button className='btn btn-warning mx-3'
                                                        onClick={() => handleEditService(item)}><i className="fa fa-pencil"></i>Sửa</button>
                                                <button className='btn btn-danger'
                                                        onClick={() => handleDeleteService(item)}><i className="fa fa-trash"></i>Xóa</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </>
                        :
                            <><tr><td colSpan={7}>Không tìm thấy dịch vụ.</td></tr></>
                    }
                </tbody>
            </table>
        </div>
        {isEditing && (
            <>
                <hr />
                <div className='edit-service-form row mb-3'>
                    <h4>Chỉnh sửa dịch vụ:</h4>
                    <div className='col-3 form-group'>
                        <label>Tên dịch vụ:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={tenDV}
                            onChange={(event) => setServiceName(event.target.value)}
                        />
                    </div>
                    <div className='col-2 form-group'>
                        <label>Đơn vị tính:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={donViTinh}
                            onChange={(event) => setUnit(event.target.value)}
                        />
                    </div>
                    <div className='col-2 form-group'>
                        <label>Đơn giá:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={donGia}
                            onChange={(event) => setPrice(event.target.value)}
                        />
                    </div>
                    <div className='col-4 form-group'>
                        <label>Ghi chú:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={ghiChuDV}
                            onChange={(event) => setNote(event.target.value)}
                        />
                    </div>
                    <div className='col-1 mt-4 actions'>
                        <i className="fa fa-floppy-o save" title="Lưu" onClick={handleSaveService}></i>
                        <i className="fa fa-undo cancel" title="Hủy" onClick={() => setIsEditing(false)}></i>
                    </div>
                </div>
            </>   
        )}

        {totalPages > 0 &&
            <div className='service-footer'>
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

export default TableService;