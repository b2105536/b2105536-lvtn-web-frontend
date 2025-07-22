import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { fetchHouse, fetchState, createNewRoom, updateCurrentRoom } from '../../services/roomService';
import { toast } from 'react-toastify';
import _ from 'lodash';

const ModalRoom = (props) => {
    const { action, dataModalRoom } = props;

    const defaultRoomData = {
        tenPhong: '',
        coGacXep: '',
        giaThue: '',
        dienTich: '',
        sucChua: '',
        ttPhongId: '',
        nhaId: ''
    }

    const validDefaultInputs = {
        tenPhong: true,
        coGacXep: true,
        giaThue: true,
        dienTich: true,
        sucChua: true,
        ttPhongId: true,
        nhaId: true
    }

    const [roomData, setRoomData] = useState(defaultRoomData);
    const [validInputs, setValidInputs] = useState(validDefaultInputs);

    const [roomStates, setRoomStates] = useState([]);
    const [roomHouses, setRoomHouses] = useState([]);

    useEffect (() => {
        getRoomStats();
        getHouses();
    }, []);

    useEffect (() => {
        if (action === 'UPDATE') {
            setRoomData({
                ...dataModalRoom,
                ttPhongId: dataModalRoom.BangMa ? dataModalRoom.BangMa.id : '',
                nhaId: dataModalRoom.Nha ? dataModalRoom.Nha.id : ''});
        }
    }, [dataModalRoom]);

    useEffect (() => {
        if (action === 'CREATE') {
            if (roomStates && roomStates.length > 0) {
                setRoomData(prev => ({ ...prev, ttPhongId: roomStates[0].id }));
            }
            if (roomHouses && roomHouses.length > 0) {
                setRoomData(prev => ({ ...prev, nhaId: roomHouses[0].id }));
            }
        }
    }, [action]);

    const getRoomStats = async () => {
        let res = await fetchState("TTPHONG");
        if (res && res.EC === 0) {
            setRoomStates(res.DT);
            if (action === 'CREATE' && res.DT && res.DT.length > 0) {
                let stats = res.DT;
                let emptyState = stats.find(item => item.giaTri === 'Còn trống');
                if (emptyState) {
                    setRoomData(prev => ({ ...prev, ttPhongId: emptyState.id }));
                }
            }
        } else {
            toast.error(res.EM);
        }
    }

    const getHouses = async () => {
        let res = await fetchHouse();
        if (res && res.EC === 0) {
            setRoomHouses(res.DT);
            if (res.DT && res.DT.length > 0) {
                let houses = res.DT;
                setRoomData(prev => ({ ...prev, nhaId: houses[0].id }));
            }
        } else {
            toast.error(res.EM);
        }
    }

    const handleOnChangeInput = (value, name) => {
        let _roomData = _.cloneDeep(roomData);
        _roomData[name] = value;
        setRoomData(_roomData);
    }

    const checkValidInputs = () => {
        if (action === 'UPDATE') return true;

        setValidInputs(validDefaultInputs);

        let arr = ['tenPhong', 'giaThue', 'dienTich', 'sucChua', 'ttPhongId', 'nhaId'];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            if (!roomData[arr[i]]) {
                let _validInputs = _.cloneDeep(validDefaultInputs);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs);

                toast.error('Các trường được đánh dấu không được rỗng.');
                check = false;
                break;
            }
        }
        return check;
    }

    const handleConfirmRoom = async () => {
        let check = checkValidInputs();
        if (check === true) {
            let res = action === 'CREATE' ?
                await createNewRoom(roomData)
            :   await updateCurrentRoom(roomData);

            if (res && res.EC === 0) {
                props.onHide();
                setRoomData({
                    ...defaultRoomData,
                    ttPhongId: roomStates && roomStates.length > 0 ? roomStates[0].id : '',    // Tạo mới cần nạp lại
                    nhaId: roomHouses && roomHouses.length > 0 ? roomHouses[0].id : ''         // Tạo mới cần nạp lại
                });
                toast.success(res.EM);
            } else {
                toast.error(res.EM);
                let _validInputs = _.cloneDeep(validDefaultInputs);
                _validInputs[res.DT] = false;
                setValidInputs(_validInputs);
            }
        }
    }

    const handleCloseModalRoom = () => {
        props.onHide();
        setRoomData(defaultRoomData);
        setValidInputs(validDefaultInputs);
    }

    return (
        <>
            <Modal size="lg" show={props.show} onHide={() => handleCloseModalRoom()} className='modal-room'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>{props.action === 'CREATE' ? 'Tạo phòng trọ mới' : 'Cập nhật thông tin phòng trọ'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Tên phòng (<span className='red'>*</span>):</label>
                            <input
                                className={validInputs.tenPhong ? 'form-control' : 'form-control is-invalid'}
                                type='text'
                                value={roomData.tenPhong}
                                onChange={(event) => handleOnChangeInput(event.target.value, 'tenPhong')}                      
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Giá thuê (<span className='red'>*</span>):</label>
                            <input
                                className={validInputs.giaThue ? 'form-control' : 'form-control is-invalid'}
                                type='text'
                                value={roomData.giaThue}
                                onChange={(event) => handleOnChangeInput(event.target.value, 'giaThue')}                        
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Diện tích (<span className='red'>*</span>):</label>
                            <input
                                className={validInputs.dienTich ? 'form-control' : 'form-control is-invalid'}
                                type='text'
                                value={roomData.dienTich}
                                onChange={(event) => handleOnChangeInput(event.target.value, 'dienTich')}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Sức chứa (<span className='red'>*</span>):</label>
                            <input
                                className={validInputs.sucChua ? 'form-control' : 'form-control is-invalid'}
                                type='number' min='1' max='8' step='1'
                                value={roomData.sucChua}
                                onChange={(event) => handleOnChangeInput(event.target.value, 'sucChua')}
                            />
                        </div>
                        {action === 'UPDATE' && (
                            <div className='col-12 col-sm-4 form-group'>
                                <label>Trạng thái (<span className='red'>*</span>):</label>
                                <select className={validInputs.ttPhongId ? 'form-select' : 'form-select is-invalid'}
                                    onChange={(event) => handleOnChangeInput(event.target.value, 'ttPhongId')}
                                    value={roomData.ttPhongId}
                                    disabled>
                                    {roomStates.length > 0 &&
                                        roomStates.map((item, index) => {
                                            return (
                                                <option key={`stat-${index}`} value={item.id}>{item.giaTri}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        )}
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Nhà trọ (<span className='red'>*</span>):</label>
                            <select className={validInputs.nhaId ? 'form-select' : 'form-select is-invalid'}
                                onChange={(event) => handleOnChangeInput(event.target.value, 'nhaId')}
                                value={roomData.nhaId}>
                                {roomHouses.length > 0 &&
                                    roomHouses.map((item, index) => {
                                        return (
                                            <option key={`stat-${index}`} value={item.id}>{item.ten}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-12 col-sm-2 form-group d-flex justify-content-center align-items-center mt-4'>
                            <div className='form-check'>
                                <input
                                    className='form-check-input'
                                    type='checkbox'
                                    id='checkMe'
                                    checked={roomData.coGacXep}
                                    onChange={(event) => handleOnChangeInput(event.target.checked, 'coGacXep')}
                                    // checked // isAssigned === true => checked
                                />
                                <label className='form-check-label' htmlFor='checkMe'>
                                    Gác xếp
                                </label>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalRoom()}>Đóng</Button>
                    <Button variant="primary" onClick={() => handleConfirmRoom()}>
                        {action === 'CREATE' ? 'Lưu thay đổi': 'Cập nhật'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalRoom;