import { useEffect, useState } from 'react';
import './ModalEditHouse.scss';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updateHouseInfo, fetchHouseImages } from '../../services/managementService';

const ModalEditHouse = (props) => {
    const { show, handleClose, house } = props;
    const [ten, setHouseName] = useState('');
    const [moTa, setHouseDescription] = useState('');
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (house) {
            setHouseName(house.ten || '');
            setHouseDescription(house.moTa || '');
            getHouseImages();
        }
    }, [house]);

    const getHouseImages = async () => {
        if (house?.id) {
            const res = await fetchHouseImages(house.id);
            if (res && res.EC === 0) {
                const imageList = res.DT.map(item => item.duongDan);
                setImages(imageList);
                setPreviews(imageList);
            } else {
                toast.error(res?.EM);
            }
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const res = await updateHouseInfo({ id: house.id, ten, moTa, images });
            if (res && res.EC === 0) {
                toast.success(res.EM);
                handleClose(true);
            } else {
                toast.error(res.EM);
            }
        } catch (err) {
            toast.error("Có lỗi xảy ra khi cập nhật.");
            console.log(err);
        } finally {
            setIsLoading(false);
        }   
    }

    const handleAddSingleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSizePerFileMB = 2;
        const maxTotalSizeMB = 10;
        const maxTotalBytes = maxTotalSizeMB * 1024 * 1024;

        if (file.size > maxSizePerFileMB * 1024 * 1024) {
            toast.error(`Ảnh vượt quá ${maxSizePerFileMB}MB, vui lòng chọn ảnh nhỏ hơn.`);
            e.target.value = null;
            return;
        }

        const currentTotalSize = images.reduce((total, base64) => {
            const sizeInBytes = Math.ceil((base64.length * 3) / 4);
            return total + sizeInBytes;
        }, 0);

        if ((currentTotalSize + file.size) > maxTotalBytes) {
            toast.error(`Tổng dung lượng ảnh vượt quá ${maxTotalSizeMB}MB. Vui lòng xóa bớt hoặc chọn ảnh nhỏ hơn.`);
            e.target.value = null;
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImages(prev => [...prev, reader.result]);
            setPreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);

        e.target.value = null;
    }

    const handleRemoveImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviews(newPreviews);
    }

    const resetModal = () => {
        setImages([]);
        setPreviews([]);
    }

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
                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={moTa}
                            onChange={(e) => setHouseDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ảnh nhà trọ (tối đa 5 ảnh)</Form.Label>
                        <div className="preview-images mt-2 d-flex gap-2 flex-wrap">
                            {previews.map((img, idx) => (
                                <div key={idx} className="image-box">
                                    <img src={img} alt={`preview-${idx}`} />
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => handleRemoveImage(idx)}
                                    ></button>
                                </div>
                            ))}

                            {previews.length < 5 && (
                                <div className="image-box add-box" onClick={() => document.getElementById('hiddenFileInput').click()}>
                                    <span style={{ fontSize: '2rem', color: '#aaa' }}>＋</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="hiddenFileInput"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleAddSingleImage(e)}
                                    />
                                </div>
                            )}
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { resetModal(); handleClose(false) }} disabled={isLoading}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={() => handleSubmit()} disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang lưu...
                        </>
                    ) : 'Lưu thay đổi'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEditHouse;