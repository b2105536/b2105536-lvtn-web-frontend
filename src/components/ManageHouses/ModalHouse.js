import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { fetchUser, fetchProvince, fetchDistrictsByProvince, fetchWardsByDistrict, createNewHouse, updateCurrentHouse } from '../../services/houseService';
import { toast } from 'react-toastify';
import _ from 'lodash';

const ModalHouse = (props) => {
    const { action, dataModalHouse } = props;
    
    const defaultHouseData = {
        ten: '',
        diaChi: '',
        moTa: '',
        chuTroId: '',
        tinhId: '',
        huyenId: '',
        xaId: ''
    }

    const validDefaultInputs = {
        ten: true,
        diaChi: true,
        moTa: true,
        chuTroId: true,
        tinhId: true,
        huyenId: true,
        xaId: true
    }

    const [houseData, setHouseData] = useState(defaultHouseData);
    const [validInputs, setValidInputs] = useState(validDefaultInputs);
    const [users, setUsers] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(() => {
        if (houseData.tinhId) {
            getDistricts(houseData.tinhId);
        } else {
            setDistricts([]);
            setHouseData(prev => ({ ...prev, huyenId: '', xaId: '' }));
        }
    }, [houseData.tinhId]);

    useEffect(() => {
        if (houseData.huyenId) {
            getWards(houseData.huyenId);
        } else {
            setWards([]);
            setHouseData(prev => ({ ...prev, xaId: '' }));
        }
    }, [houseData.huyenId]);

    const fetchInitData = async () => {
        const [userRes, provinceRes] = await Promise.all([fetchUser(), fetchProvince()]);
        if (userRes?.EC === 0) setUsers(userRes.DT || []);
        if (provinceRes?.EC === 0) setProvinces(provinceRes.DT || []);
    };

    useEffect(() => {
        const initUpdateData = async () => {
            if (action === 'UPDATE' && dataModalHouse) {
            try {
                fetchInitData();

                const tinhId = dataModalHouse.Xa?.Tinh?.id ?? '';
                const huyenId = dataModalHouse.Xa?.Huyen?.id ?? '';
                const xaId = dataModalHouse.Xa?.id ?? '';

                const resDistricts = tinhId ? await fetchDistrictsByProvince(tinhId) : null;
                if (resDistricts?.EC === 0) setDistricts(resDistricts.DT?.Huyens || []);

                const resWards = huyenId ? await fetchWardsByDistrict(huyenId) : null;
                if (resWards?.EC === 0) setWards(resWards.DT?.Xas || []);

                setHouseData({
                    ...dataModalHouse,
                    chuTroId: dataModalHouse.NguoiDung?.id || '',
                    tinhId,
                    huyenId,
                    xaId
                });

            } catch (error) {
                toast.error("Lỗi khi load dữ liệu cập nhật.");
            }
            }
        };

        initUpdateData();
    }, [action, dataModalHouse]);

    useEffect (() => {
        if (action === 'CREATE') {
            setHouseData({ ...defaultHouseData });
            fetchInitData();
            setDistricts([]);
            setWards([]);
        }
    }, [action]);

    // const getUsers = async () => {
    //     let res = await fetchUser();
    //     if (res && res.EC === 0) {
    //         let users = res.DT || [];
    //         setUsers(users);
    //         return users;
    //     } else {
    //         toast.error(res.EM);
    //         return [];
    //     }
    // }

    // const getProvinces = async () => {
    //     let res = await fetchProvince();
    //     if (res && res.EC === 0) {
    //         setProvinces(res.DT || []);
    //         return res.DT || [];
    //     } else {
    //         toast.error(res.EM);
    //         return [];
    //     }
    // }

    const getDistricts = async (tinhId) => {
        let res = await fetchDistrictsByProvince(tinhId);
        if (res && res.EC === 0) {
            const districtsList = res.DT?.Huyens || [];
            setDistricts(districtsList);

            // if (action === 'UPDATE' && districtsList.length > 0 && !houseData.huyenId) {
            //     setHouseData(prev => ({
            //         ...prev,
            //         huyenId: districtsList[0].id
            //     }));
            // }
        } else {
            toast.error(res.EM);
        }
    }

    const getWards = async (huyenId) => {
        let res = await fetchWardsByDistrict(huyenId);
        if (res && res.EC === 0) {
            const wardsList = res.DT?.Xas || [];
            setWards(wardsList);

            // if (action === 'UPDATE' && wardsList.length > 0 && !houseData.xaId) {
            //     setHouseData(prev => ({
            //         ...prev,
            //         xaId: wardsList[0].id
            //     }));
            // }
        } else {
            toast.error(res.EM);
        }
    }

    const handleOnChangeInput = (value, name) => {
        let _houseData = _.cloneDeep(houseData);
        _houseData[name] = value;
        setHouseData(_houseData);
    }

    const checkValidInputs = () => {
        if (action === 'UPDATE') return true;
    
        setValidInputs(validDefaultInputs);
        let _validInputs = _.cloneDeep(validDefaultInputs);
        if (!houseData.ten) {
            _validInputs.ten = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng nhập tên.");
            return false;
        }

        if (!houseData.diaChi) {
            _validInputs.diaChi = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng nhập địa chỉ.");
            return false;
        }

        if (!houseData.tinhId) {
            _validInputs.tinhId = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng chọn tỉnh/thành phố.");
            return false;
        }

        if (!houseData.huyenId) {
            _validInputs.huyenId = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng chọn quận/huyện.");
            return false;
        }

        if (!houseData.xaId) {
            _validInputs.xaId = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng chọn xã/phường.");
            return false;
        }
        
        if (!houseData.chuTroId) {
            _validInputs.chuTroId = false;
            setValidInputs(_validInputs);
            toast.error("Vui lòng chọn người đại diện.");
            return false;
        }

        return true;
    }

    const handleConfirmHouse = async () => {
        let check = checkValidInputs();
        if (check === true) {
            let res = action === 'CREATE' ?
                    await createNewHouse({...houseData, chuTroId: houseData['chuTroId']})
                :
                    await updateCurrentHouse({...houseData, chuTroId: houseData['chuTroId']});
            if (res && res.EC === 0) {
                toast.success(res.EM);
                props.onHide();
                setHouseData({
                    ...defaultHouseData,
                    chuTroId: users && users.length > 0 ? users[0].id : ''
                });
            } 
            
            if (res && res.EC !== 0) {
                toast.error(res.EM);
                let _validInputs = _.cloneDeep(validDefaultInputs);
                _validInputs[res.DT] = false;
                setValidInputs(_validInputs);
            }
        }
    }

    const handleCloseModalHouse = () => {
        props.onHide();
        setHouseData(defaultHouseData);
        setValidInputs(validDefaultInputs);
    }

    return (
        <>
            <Modal size="lg" show={props.show} onHide={() => handleCloseModalHouse()} className='modal-house'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>{props.action === 'CREATE' ? 'Tạo nhà trọ mới' : 'Cập nhật thông tin nhà trọ'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Tên nhà trọ (<span className='red'>*</span>):</label>
                            <input className={validInputs.ten ? 'form-control' : 'form-control is-invalid'}
                            type='text' value={houseData.ten}
                                onChange={(event) => handleOnChangeInput(event.target.value, "ten")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Địa chỉ (<span className='red'>*</span>):</label>
                            <input className={validInputs.diaChi ? 'form-control' : 'form-control is-invalid'}
                            type='text' value={houseData.diaChi}
                                onChange={(event) => handleOnChangeInput(event.target.value, "diaChi")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Tỉnh/Thành phố (<span className='red'>*</span>):</label>
                            <select className={validInputs.tinhId ? 'form-select' : 'form-select is-invalid'}
                                value={houseData.tinhId}
                                onChange={(event) => handleOnChangeInput(event.target.value, "tinhId")}
                            >
                                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                                {provinces.length > 0 &&
                                    provinces.map((item, index) => {
                                        return (
                                            <option key={`province-${index}`} value={item.id}>{item.tenTinh}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Huyện/Quận (<span className='red'>*</span>):</label>
                            <select className={validInputs.huyenId ? 'form-select' : 'form-select is-invalid'}
                                value={houseData.huyenId}
                                disabled={!houseData.tinhId}
                                onChange={(event) => handleOnChangeInput(event.target.value, "huyenId")}
                            >
                                <option value="">-- Chọn Huyện/Quận --</option>
                                {districts.length > 0 &&
                                    districts.map((item, index) => {
                                        return (
                                            <option key={`district-${index}`} value={item.id}>{item.tenHuyen}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Xã/Phường (<span className='red'>*</span>):</label>
                            <select className={validInputs.xaId ? 'form-select' : 'form-select is-invalid'}
                                value={houseData.xaId}
                                disabled={!houseData.huyenId}
                                onChange={(event) => handleOnChangeInput(event.target.value, "xaId")}
                            >
                                <option value="">-- Chọn Xã/Phường --</option>
                                {wards.length > 0 &&
                                    wards.map((item, index) => {
                                        return (
                                            <option key={`ward-${index}`} value={item.id}>{item.tenXa}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Mô tả:</label>
                            <input className='form-control' type='text' value={houseData.moTa}
                                onChange={(event) => handleOnChangeInput(event.target.value, "moTa")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Người đại diện (<span className='red'>*</span>):</label>
                            <select className={validInputs.chuTroId ? 'form-select' : 'form-select is-invalid'}
                                onChange={(event) => handleOnChangeInput(event.target.value, "chuTroId")}
                                value={houseData.chuTroId}
                            >
                                {users.length > 0 &&
                                    users.map((item, index) => {
                                        return (
                                            <option key={`user-${index}`} value={item.id}>{item.hoTen}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalHouse()}>
                    Đóng
                    </Button>
                    <Button variant="primary" onClick={() => handleConfirmHouse()}>
                    {action === 'CREATE' ? 'Lưu thay đổi': 'Cập nhật'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalHouse;