import './GroupRole.scss';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchGroup } from '../../services/userService';
import { fetchRole, fetchRolesByGroup, assignRolesToGroup } from '../../services/roleService';
import _ from 'lodash';

const GroupRole = () => {
    const [userGroups, setUserGroups] = useState([]);
    const [listRoles, setListRoles] = useState([]);
    const [selectGroup, setSelectGroup] = useState("");
    const [assignRoles, setAssignRoles] = useState([]);

    useEffect (() => {
        getGroups();
        getAllRoles();
    }, []);

    const getGroups = async () => {
        let res = await fetchGroup();
        if (res && res.EC === 0) {
            setUserGroups(res.DT);
        } else {
            toast.error(res.EM);
        }
    }

    const getAllRoles = async () => {
        let data = await fetchRole();
        if (data && +data.EC === 0) {
            setListRoles(data.DT);
        }
    }

    const handleOnChangeGroup = async (value) => {
        setSelectGroup(value);
        if (value) {
            let data = await fetchRolesByGroup(value);
            if (data && +data.EC === 0) {
                let result = buildDataRolesByGroup(data.DT.Quyens, listRoles);
                setAssignRoles(result);
            }
        }
    }

    const buildDataRolesByGroup = (groupRoles, allRoles) => {
        let result = [];
        if (allRoles && allRoles.length > 0) {
            allRoles.map(role => {
                let obj = {};   
                obj.url = role.url;
                obj.id = role.id;
                obj.quyenHan = role.quyenHan;
                obj.isAssigned = false;
                if (groupRoles && groupRoles.length > 0) {
                    obj.isAssigned = groupRoles.some(item => item.url === obj.url);
                }

                result.push(obj);
            })
        }
        return result;
    }

    const handleSelectRole = (value) => {
        const _assignRoles = _.cloneDeep(assignRoles);
        let foundIndex = _assignRoles.findIndex(item => +item.id === +value);
        if (foundIndex > -1) {
            _assignRoles[foundIndex].isAssigned = !_assignRoles[foundIndex].isAssigned;
        }
        setAssignRoles(_assignRoles);
    }
    
    const buildDataToSave = () => {
        let result = {};
        const _assignRoles = _.cloneDeep(assignRoles);
        result.nhomId = selectGroup;
        let groupRolesFilter = _assignRoles.filter(item => item.isAssigned === true);
        let finalGroupRoles = groupRolesFilter.map(item => {
            let data = {nhomId: +selectGroup, quyenId: +item.id};
            return data;
        });
        result.groupRoles = finalGroupRoles;
        return result;
    }

    const handleSave = async () => {
        let data = buildDataToSave();
        let res = await assignRolesToGroup(data);
        if (res && res.EC === 0) {
            toast.success(res.EM);
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <div className='group-role-container'>
            <div className='container'>
                <div className='container mt-3'>
                    <h3>Nhóm người dùng - Quyền hạn</h3>
                    <div className='assign'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Nhóm người dùng (<span className='red'>*</span>):</label>
                            <select className='form-select'
                                onChange={(event) => handleOnChangeGroup(event.target.value)}
                            >
                                <option value="">-- Chọn nhóm người dùng --</option>
                                {userGroups.length > 0 &&
                                    userGroups.map((item, index) => {
                                        return (
                                            <option key={`group-${index}`} value={item.id}>{item.tenNhom}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <hr />
                        {selectGroup && 
                            <div className='roles'>
                                <h4>Phân quyền:</h4>
                                {assignRoles && assignRoles.length > 0 &&
                                    assignRoles.map((item, index) => {
                                        return (
                                            <div className='form-check' key={`list-role-${index}`}>
                                                <input
                                                    className='form-check-input'
                                                    type='checkbox'
                                                    value={item.id}
                                                    id={`list-role-${index}`}
                                                    checked={item.isAssigned} // isAssigned === true => checked
                                                    onChange={(event) => handleSelectRole(event.target.value)}
                                                />
                                                <label className='form-check-label' htmlFor={`list-role-${index}`}>
                                                    {item.url}
                                                </label>
                                            </div>
                                        );
                                    })
                                }
                                <div className='mt-3'>
                                    <button className='btn btn-warning mb-4' onClick={() => handleSave()}>Lưu thay đổi</button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupRole;