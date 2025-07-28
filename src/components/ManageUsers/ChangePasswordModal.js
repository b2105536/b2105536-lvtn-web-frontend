import React, { useContext, useState } from 'react';
import './Users.scss';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { changePassword, logoutUser } from '../../services/userService';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

const ChangePasswordModal = (props) => {
    const { show, handleClose } = props;

    const { logoutContext } = useContext(UserContext);
    const history = useHistory();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const resetFields = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setValidated(false);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setValidated(true);

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Mật khẩu mới phải có ít nhất 8 ký tự.");
            return;
        }

        if (newPassword === oldPassword) {
            toast.error("Mật khẩu mới phải khác mật khẩu cũ.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới không khớp!");
            return;
        }

        setIsSubmitting(true);
        const res = await changePassword({ oldPassword, newPassword });
        setIsSubmitting(false);
        if (res && res.EC === 0) {
            toast.success(res.EM);
            resetFields();
            handleClose();

            await logoutUser();
            localStorage.removeItem('jwt');
            logoutContext();
            history.push('/login');
            toast.info("Vui lòng đăng nhập lại với mật khẩu mới.");
        } else {
            toast.error(res.EM);
        }
    };

    return (
        <Modal show={show} onHide={() => { handleClose(); resetFields(); }} className='modal-change-password'>
            <Modal.Header closeButton>
                <Modal.Title>Đổi mật khẩu</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} className='form-body'>
                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu cũ (<span className='red'>*</span>)</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showOldPassword ? "text" : "password"}
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Nhập mật khẩu cũ"
                                autoFocus
                            />
                            <InputGroup.Text onClick={() => setShowOldPassword(!showOldPassword)} style={{ cursor: 'pointer' }}>
                                <i className={`fa ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mật khẩu mới (<span className='red'>*</span>)</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showNewPassword ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                            />
                            <InputGroup.Text onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: 'pointer' }}>
                                <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Xác nhận mật khẩu mới (<span className='red'>*</span>)</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                            />
                            <InputGroup.Text onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ cursor: 'pointer' }}>
                                <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => { handleClose(); resetFields(); }}>Đóng</Button>
                <Button variant="primary" onClick={() => handleSubmit()} disabled={isSubmitting}>
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ChangePasswordModal;