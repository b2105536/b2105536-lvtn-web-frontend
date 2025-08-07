import './ManageAssets.scss';
import { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { createAssets } from '../../services/managementService';
import TableAsset from './TableAsset';

const ManageAssets = (props) => {
    const history = useHistory();

    const childDefaultData = { tenTaiSan: '', moTaTaiSan: '', dvtTaiSan: '', isValidUrl: true }
    const childRef = useRef();

    const [listChilds, setListChilds] = useState({
        child: childDefaultData
    })

    const handleOnChangeInput = (name, value, key) => {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[key][name] = value;

        if (value && name === 'tenTaiSan') {
            _listChilds[key]['isValidUrl'] = true;
        }
        setListChilds(_listChilds);
    }

    const handleAddNewInput = () => {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[`child-${uuidv4()}`] = childDefaultData;
        setListChilds(_listChilds);
    }

    const handleDeleteInput = (key) => {
        let _listChilds = _.cloneDeep(listChilds);
        delete _listChilds[key];
        setListChilds(_listChilds);
    }

    const buildDataToPersist = () => {
        let _listChilds = _.cloneDeep(listChilds);
        let result = [];
        Object.entries(_listChilds).map(([key, child], index) => {
            result.push({
                tenTaiSan: child.tenTaiSan,
                moTaTaiSan: child.moTaTaiSan,
                dvtTaiSan: child.dvtTaiSan
            });
        })
        return result;
    }

    const handleSave = async () => {
        let invalidObj = Object.entries(listChilds).find(([key, child], index) => {
            return child && !child.tenTaiSan;
        });

        if (!invalidObj) {
            let data = buildDataToPersist();
            let res = await createAssets(data);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                childRef.current.fetchListAssetsAgain();
                setListChilds({ child: childDefaultData });
            }
        } else {
            toast.error("Tên tài sản không được rỗng.");
            let _listChilds = _.cloneDeep(listChilds);
            const key = invalidObj[0];
            _listChilds[key]['isValidUrl'] = false;
            setListChilds(_listChilds);
        }
    }

    return (
        <div className='asset-container mt-3'>
            <div className='container'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <span onClick={() => history.push('/rooms')}>
                                Danh sách phòng trọ
                            </span>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Quản lý tài sản
                        </li>
                    </ol>
                </nav>
                <div className='adding-assets mt-3'>
                    <div className='title-asset'><h3>Thêm tài sản</h3></div>
                    <div className='asset-parent'>
                        {
                            Object.entries(listChilds).map(([key, child], index) => {
                                return( 
                                    <div className='row asset-child' key={`child-${key}`}>
                                        <div className={`col-3 form-group ${key}`}>
                                            <label><span className='red'>*</span>Tên tài sản:</label>
                                            <input
                                                type='text'
                                                className={child.isValidUrl ? 'form-control' : 'form-control is-invalid'}
                                                value={child.tenTaiSan}
                                                onChange={(event) => handleOnChangeInput('tenTaiSan', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-5 form-group'>
                                            <label>Mô tả:</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={child.moTaTaiSan}
                                                onChange={(event) => handleOnChangeInput('moTaTaiSan', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-3 form-group'>
                                            <label>Đơn vị tính:</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={child.dvtTaiSan}
                                                onChange={(event) => handleOnChangeInput('dvtTaiSan', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-1 mt-4 actions'>
                                            <i className="fa fa-plus-circle add" title="Thêm" onClick={() => handleAddNewInput()}></i>
                                            {index >= 1 &&
                                                <i className="fa fa-trash delete" title="Xóa" onClick={() => handleDeleteInput(key)}></i>
                                            }
                                        </div>
                                    </div>
                                );
                            })
                        }
                        <div>
                            <button className='btn btn-primary mt-3' onClick={() => handleSave()}>Lưu thay đổi</button>
                        </div>
                    </div>   
                </div>
                <hr />
                <div className='mt-3 table-asset'>
                    <h4>Danh sách tài sản đi kèm:</h4>
                    <TableAsset ref={childRef} />
                </div>
            </div>
        </div>
    );
}

export default ManageAssets;