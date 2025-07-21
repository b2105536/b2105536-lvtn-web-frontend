import './Role.scss';
import { useRef, useState } from 'react';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { createRoles } from '../../services/roleService';
import TableRole from './TableRole';

const Role = (props) => {
    const childDefaultData = { url: '', quyenHan: '', isValidUrl: true }
    const childRef = useRef();

    const [listChilds, setListChilds] = useState({
        child1: childDefaultData
    })

    const handleOnChangeInput = (name, value, key) => {
        let _listChilds = _.cloneDeep(listChilds);
        _listChilds[key][name] = value;

        if (value && name === 'url') {
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
                url: child.url,
                quyenHan: child.quyenHan
            });
        })
        return result;
    }

    const handleSave = async () => {
        let invalidObj = Object.entries(listChilds).find(([key, child], index) => {
            return child && !child.url;
        });

        if (!invalidObj) {
            let data = buildDataToPersist();
            let res = await createRoles(data);
            if (res && res.EC === 0) {
                toast.success(res.EM);
                childRef.current.fetchListRolesAgain();
                setListChilds({ child1: childDefaultData });
            }
        } else {
            toast.error("URL không được rỗng.");
            let _listChilds = _.cloneDeep(listChilds);
            const key = invalidObj[0];
            _listChilds[key]['isValidUrl'] = false;
            setListChilds(_listChilds);
        }
    }

    return (
        <div className='role-container'>
            <div className='container'>
                <div className='adding-roles mt-3'>
                    <div className='title-role'><h3>Thêm quyền hạn</h3></div>
                    <div className='role-parent'>
                        {
                            Object.entries(listChilds).map(([key, child], index) => {
                                return( 
                                    <div className='row role-child' key={`child-${key}`}>
                                        <div className={`col-5 form-group ${key}`}>
                                            <label>URL:</label>
                                            <input
                                                type='text'
                                                className={child.isValidUrl ? 'form-control' : 'form-control is-invalid'}
                                                value={child.url}
                                                onChange={(event) => handleOnChangeInput('url', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-5 form-group'>
                                            <label>Quyền hạn:</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                value={child.quyenHan}
                                                onChange={(event) => handleOnChangeInput('quyenHan', event.target.value, key)}
                                            />
                                        </div>
                                        <div className='col-2 mt-4 actions'>
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
                <div className='mt-3 table-role'>
                    <h4>Danh sách quyền hạn hiện thời:</h4>
                    <TableRole ref={childRef} />
                </div>
            </div>
        </div>
    );
}

export default Role;