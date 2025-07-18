import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from 'react';
import { fetchHouse, fetchState, createNewRoom } from '../../services/roomService';
import { toast } from 'react-toastify';
import _ from 'lodash';

const ModalRoom = (props) => {
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

    const getRoomStats = async () => {
        let res = await fetchState("TTPHONG");
        if (res && res.EC === 0) {
            setRoomStates(res.DT);
            if (res.DT && res.DT.length > 0) {
                let stats = res.DT;
                setRoomData(prev => ({ ...prev, ttPhongId: stats[0].id }));
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
            let res = await createNewRoom(roomData);
            if (res && res.EC === 0) {
                props.onHide();
                setRoomData({
                    ...defaultRoomData,
                    ttPhongId: roomStates[0].id,    // Tạo mới cần nạp lại
                    nhaId: roomHouses[0].id         // Tạo mới cần nạp lại
                });
            } else {
                toast.error(res.EM);
                let _validInputs = _.cloneDeep(validDefaultInputs);
                _validInputs[res.DT] = false;
                setValidInputs(_validInputs);
            }
        }
    }

    return (
        <>
            <Modal size="lg" show={props.show} onHide={props.onHide} className='modal-room'>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>{props.title}</span>
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
                        <div className='col-12 col-sm-4 form-group'>
                            <label>Trạng thái (<span className='red'>*</span>):</label>
                            <select className={validInputs.ttPhongId ? 'form-select' : 'form-select is-invalid'}
                                onChange={(event) => handleOnChangeInput(event.target.value, 'ttPhongId')}>
                                {roomStates.length > 0 &&
                                    roomStates.map((item, index) => {
                                        return (
                                            <option key={`stat-${index}`} value={item.id}>{item.giaTri}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-12 col-sm-6 form-group'>
                            <label>Nhà trọ (<span className='red'>*</span>):</label>
                            <select className={validInputs.nhaId ? 'form-select' : 'form-select is-invalid'}
                            onChange={(event) => handleOnChangeInput(event.target.value, 'nhaId')}>
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
                                    value={roomData.coGacXep}
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
                    <Button variant="secondary" onClick={props.onHide}>Đóng</Button>
                    <Button variant="primary" onClick={() => handleConfirmRoom()}>
                    Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalRoom;