import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { fetchAllAssets, deleteAsset, updateCurrentAsset } from "../../services/managementService";
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const TableAsset = forwardRef ((props, ref) => {
    const [listAssets, setListAssets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [tenTaiSan, setAssetName] = useState('');
    const [moTaTaiSan, setAssetDiscription] = useState('');
    const [dvtTaiSan, setAssetUnit] = useState('');

    useEffect (() => {
        getAllAssets() ;
    }, [currentPage]);

    useImperativeHandle (ref, () => ({
        fetchListAssetsAgain() {
            getAllAssets();
        }
    }));

    const getAllAssets = async () => {
        let res = await fetchAllAssets(currentPage, currentLimit);
        if (res && +res.EC === 0) {
            setTotalPages(res.DT.totalPages);
            setListAssets(res.DT.assets);
        }
    }

    const handlePageClick = async (event) => {
        setCurrentPage(+event.selected + 1);
    };

    const handleDeleteAsset = async (asset) => {
        let data = await deleteAsset(asset);
        if (data && +data.EC === 0) {
            toast.success(data.EM);
            await getAllAssets();
        } else {
            toast.error(data.EM);
        }
    }

    const handleEditAsset = (asset) => {
        setSelectedAsset(asset);
        setAssetName(asset.tenTaiSan);
        setAssetDiscription(asset.moTaTaiSan);
        setAssetUnit(asset.dvtTaiSan);
        setIsEditing(true);
    }

    const handleSaveAsset = async () => {
        if (tenTaiSan && moTaTaiSan && dvtTaiSan) {
            let updatedAsset = {
                ...selectedAsset,
                tenTaiSan,
                moTaTaiSan, 
                dvtTaiSan };
            let res = await updateCurrentAsset(updatedAsset);
            if (res && +res.EC === 0) {
                toast.success(res.EM);
                setIsEditing(false);
                setSelectedAsset(null);
                await getAllAssets();
            } else {
                toast.error(res.EM);
            }
        } else {
            toast.error("Vui lòng điền đủ thông tin.");
        }
    }

    return (
        <>
        <div className='asset-body'>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Tên tài sản</th>
                        <th scope="col">Mô tả</th>
                        <th scope="col">Đơn vị tính</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>                
                <tbody>
                    {listAssets && listAssets.length > 0 ?
                            <>
                                {listAssets.map((item, index) => {
                                    return (
                                        <tr key={`row-${index}`}>
                                            <td>{item.id}</td>
                                            <td>{item.tenTaiSan}</td>
                                            <td>{item.moTaTaiSan}</td>
                                            <td>{item.dvtTaiSan}</td>
                                            <td>
                                                <button className='btn btn-warning mx-3'
                                                        onClick={() => handleEditAsset(item)}><i className="fa fa-pencil"></i>Sửa</button>
                                                <button className='btn btn-danger'
                                                        onClick={() => handleDeleteAsset(item)}><i className="fa fa-trash"></i>Xóa</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </>
                        :
                            <><tr><td colSpan={5}>Không tìm thấy tài sản.</td></tr></>
                    }
                </tbody>
            </table>
        </div>
        {isEditing && (
            <>
                <hr />
                <div className='edit-asset-form row mb-3'>
                    <h4>Chỉnh sửa tài sản:</h4>
                    <div className='col-3 form-group'>
                        <label><span className='red'>*</span>Tên tài sản:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={tenTaiSan}
                            onChange={(event) => setAssetName(event.target.value)}
                        />
                    </div>
                    <div className='col-5 form-group'>
                        <label><span className='red'>*</span>Mô tả:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={moTaTaiSan}
                            onChange={(event) => setAssetDiscription(event.target.value)}
                        />
                    </div>
                    <div className='col-3 form-group'>
                        <label><span className='red'>*</span>Đơn vị tính:</label>
                        <input
                            type='text'
                            className='form-control'
                            value={dvtTaiSan}
                            onChange={(event) => setAssetUnit(event.target.value)}
                        />
                    </div>
                    <div className='col-1 mt-4 actions'>
                        <i className="fa fa-floppy-o save" title="Lưu" onClick={handleSaveAsset}></i>
                        <i className="fa fa-undo cancel" title="Hủy" onClick={() => setIsEditing(false)}></i>
                    </div>
                </div>
            </>   
        )}

        {totalPages > 0 &&
            <div className='asset-footer'>
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

export default TableAsset;