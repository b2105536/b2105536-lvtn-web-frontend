import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalDelete = (props) => {
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa người dùng</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa người dùng {props.dataModal.email} hay không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                    Đóng
                    </Button>
                    <Button variant="primary" onClick={props.confirmDeleteUser}>
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDelete;