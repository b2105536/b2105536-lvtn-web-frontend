import React, { useState, useEffect } from 'react';
import './ModalEditRoom.scss';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updateRoomInfo, fetchAsset, fetchAssetsOfRoom, saveRoomAssets } from '../../services/managementService';
import { fetchRoomStatus } from '../../services/roomService';

const ModalEditRoom = (props) => {
    const { show, onHide, roomId, roomName, roomRent, roomStat, hasContract, refresh } = props;
    const [tenPhong, setRoomName] = useState(roomName);
    const [giaThue, setRoomRent] = useState(roomRent);
    const [ttPhongId, setRoomStat] = useState(roomStat);
    const [statuses, setStatuses] = useState([]);

    const [allAssets, setAllAssets] = useState([]);
    const [roomAssets, setRoomAssets] = useState([]);
    const assetConditions = [
        "Mới",
        "Tốt",
        "Đang sử dụng",
        "Cần sửa chữa",
        "Hỏng hoàn toàn",
        "Đang bảo trì",
        "Đã thay thế",
        "Đã thanh lý"
    ];

    useEffect(() => {
        if (show) {
            setRoomName(roomName);
            setRoomRent(roomRent);
            setRoomStat(roomStat);
            getAssets();
        }
    }, [show, roomName, roomRent, roomStat]);

    useEffect(() => {
        getRoomStatuses();
    }, []);

    const getRoomStatuses = async () => {
        const res = await fetchRoomStatus();
        if (res && res.EC === 0) {
            setStatuses(res.DT);
        } else {
            toast.error(res.EM);
        }
    }

    const getAssets = async () => {
        const res1 = await fetchAsset();
        const res2 = await fetchAssetsOfRoom(roomId);

        if (res1 && res1.EC === 0) {
            setAllAssets(res1.DT);
        } else {
            toast.error(res1.EM);
        }

        if (res2 && res2.EC === 0) {
            const normalizedAssets = res2.DT?.PhongTaiSans?.map(item => ({
                taiSanId: item.TaiSan?.id,
                soLuong: item.soLuong,
                tinhTrang: item.tinhTrang
            })) || [];

            setRoomAssets(normalizedAssets);
        } else {
            toast.error(res2.EM);
        }
    }

    const handleSave = async () => {
        if (!tenPhong || !giaThue || !ttPhongId) {
            toast.warning("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const roomData = { id: roomId, tenPhong, giaThue, ttPhongId };
        const res = await updateRoomInfo(roomData);

        if (res && res.EC === 0) {
            const assetRes = await saveRoomAssets(roomId, roomAssets);
            if (assetRes && assetRes.EC === 0) {
                toast.success("Cập nhật phòng và tài sản thành công!");
                refresh();
                onHide();
            } else {
                toast.error(assetRes.EM);
            }
        } else {
            toast.error(res.EM);
        }
    }

    const handleAssetChange = (assetId, field, value) => {
        setRoomAssets(prev => {
            const exists = prev.find(item => item.taiSanId === assetId);
            if (exists) {
                return prev.map(item =>
                    item.taiSanId === assetId ? { ...item, [field]: value } : item
                );
            } else {
                return [...prev, { taiSanId: assetId, soLuong: 1, tinhTrang: '', [field]: value }];
            }
        });
    }

    const isAssetSelected = (assetId) => {
        return roomAssets.some(a => a.taiSanId === assetId);
    }

    return (
        <Modal show={show} onHide={onHide} className="modal-edit-room">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh sửa thông tin phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label><span className="red me-1">*</span>Tên phòng</Form.Label>
                        <Form.Control
                            type="text"
                            value={tenPhong}
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><span className="red me-1">*</span>Giá thuê (VNĐ)</Form.Label>
                        <Form.Control
                            type="text"
                            value={giaThue}
                            onChange={(e) => setRoomRent(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><span className="red me-1">*</span>Trạng thái phòng</Form.Label>
                        <div>
                            {statuses.map(status => (
                                <Form.Check
                                    key={status.id}
                                    inline
                                    label={status.giaTri}
                                    name="roomStatus"
                                    type="radio"
                                    id={`status-${status.id}`}
                                    checked={Number(ttPhongId) === status.id}
                                    onChange={() => setRoomStat(status.id)}
                                    disabled={
                                        (hasContract || Number(roomStat) === 5) && status.id !== Number(roomStat)
                                    }
                                />
                            ))}
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tài sản đi kèm</Form.Label>
                        <div className="asset-list">
                            {allAssets.map(asset => {
                                const assetData = roomAssets.find(a => a.taiSanId === asset.id) || {};
                                return (
                                    <div key={asset.id} className="mb-2 border p-2 rounded">
                                        <Form.Check
                                            type="checkbox"
                                            label={asset.tenTaiSan}
                                            checked={isAssetSelected(asset.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    handleAssetChange(asset.id, 'soLuong', 1);
                                                } else {
                                                    setRoomAssets(prev => prev.filter(a => a.taiSanId !== asset.id));
                                                }
                                            }}
                                        />
                                        {isAssetSelected(asset.id) && (
                                            <div className="ms-3 mt-2">
                                                <hr />
                                                <Form.Group className="mb-2">
                                                    <Form.Label>Số lượng</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        min={1}
                                                        value={assetData.soLuong || 1}
                                                        onChange={(e) =>
                                                            handleAssetChange(asset.id, 'soLuong', +e.target.value)
                                                        }
                                                    />
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label>Tình trạng</Form.Label>
                                                    <Form.Select
                                                        value={assetData.tinhTrang || ''}
                                                        onChange={(e) =>
                                                            handleAssetChange(asset.id, 'tinhTrang', e.target.value)
                                                        }
                                                    >
                                                        <option value="">-- Chọn tình trạng --</option>
                                                        {assetConditions.map((condition, index) => (
                                                            <option key={index} value={condition}>{condition}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => onHide()}>Hủy</Button>
                <Button variant="primary" onClick={() => handleSave()}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEditRoom;