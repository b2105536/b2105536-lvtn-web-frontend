import './ManageServices.scss';
import { useRef, useState } from 'react';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { createServices } from '../../services/managementService';
import TableService from './TableService';

const ManageServices = (props) => {
    const childDefaultData = { tenDV: '', donViTinh: '', ghiChuDV: '', donGia: '', isValidUrl: true }
    const childRef = useRef();

    const [listChilds, setListChilds] = useState({
        child: childDefaultData
    })

    const handleOnChangeInput = (name, value, key) => {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[key][name] = value;

        if (value && name === 'tenDV') {
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
                tenDV: child.tenDV,
                donViTinh: child.donViTinh,
                ghiChuDV: child.ghiChuDV,
                donGia: child.donGia
            });
        })
        return result;
    }

    const handleSave = async () => {
        let invalidObj = Object.entries(listChilds).find(([key, child], index) => {
            return child && !child.tenDV;
        });

        if (!invalidObj) {
            let data = buildDataToPersist();
            let res = await createServices(data);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                childRef.current.fetchListServicesAgain();
            }
        } else {
            toast.error("Tên dịch vụ không được rỗng.");
            let _listChilds = _.cloneDeep(listChilds);
            const key = invalidObj[0];
            _listChilds[key]['isValidUrl'] = false;
            setListChilds(_listChilds);
        }
    }

    return (
        <div className='service-container'>
            <div className='container'>
                <div className='adding-services mt-3'>
                    <div className='title-service'><h3>Thêm dịch vụ</h3></div>
                    <div className='service-parent'>
                        {
                            Object.entries(listChilds).map(([key, child], index) => {
                                return( 
                                    <div className='row service-child' key={`child-${key}`}>
                                        <div className={`col-3 form-group ${key}`}>
                                            <label>Tên dịch vụ:</label>
                                            <input
                                                type='text'
                                                className={child.isValidUrl ? 'form-control' : 'form-control is-invalid'}
                                                value={child.tenDV}
                                                onChange={(event) => handleOnChangeInput('tenDV', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-2 form-group'>
                                            <label>Đơn vị tính:</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={child.donViTinh}
                                                onChange={(event) => handleOnChangeInput('donViTinh', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-2 form-group'>
                                            <label>Đơn giá:</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={child.donGia}
                                                onChange={(event) => handleOnChangeInput('donGia', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-4 form-group'>
                                            <label>Ghi chú:</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={child.ghiChuDV}
                                                onChange={(event) => handleOnChangeInput('ghiChuDV', event.target.value, key)}
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
                <div className='mt-3 table-service'>
                    <h4>Danh sách dịch vụ cung cấp:</h4>
                    <TableService ref={childRef} />
                </div>
            </div>
        </div>
    );
}

export default ManageServices;