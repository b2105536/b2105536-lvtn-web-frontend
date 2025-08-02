import { useEffect, useState } from 'react';
import './ModalEditHouse.scss';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updateHouseInfo } from '../../services/managementService';

const ModalEditHouse = (props) => {
    const { show, handleClose, house } = props;
    const [ten, setHouseName] = useState('');
    const [moTa, setHouseDescription] = useState('');

    useEffect(() => {
        if (house) {
            setHouseName(house.ten || '');
            setHouseDescription(house.moTa || '');
        }
    }, [house]);

    const handleSubmit = async () => {
        const res = await updateHouseInfo({ id: house.id, ten, moTa });
        if (res && res.EC === 0) {
            toast.success(res.EM);
            handleClose(true);
        } else {
            toast.error(res.EM);
        }
    };

    return (
        <Modal show={show} onHide={() => handleClose(false)} backdrop="static" className="modal-edit-house">
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật nhà trọ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label><span className="red me-1">*</span>Tên nhà trọ</Form.Label>
                        <Form.Control
                            type="text"
                            value={ten}
                            onChange={(e) => setHouseName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={moTa}
                            onChange={(e) => setHouseDescription(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose(false)}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={() => handleSubmit()}>
                    Lưu thay đổi
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEditHouse;