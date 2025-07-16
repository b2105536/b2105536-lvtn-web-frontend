import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ModalDelete = (props) => {
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.content}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                    Đóng
                    </Button>
                    <Button variant="primary" onClick={props.confirmDelete}>
                    OK
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDelete;