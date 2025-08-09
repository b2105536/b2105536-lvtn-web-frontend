import { useEffect, useRef, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { fetchContractById } from '../../services/contractService';
import { toast } from 'react-toastify';
import ContractPreview from './ContractPreview';

const ModalContract = (props) => {
    const { show, onClose, hopDongId } = props;

    const printRef = useRef();
    const [contract, setContract] = useState(null);

    useEffect(() => {
        if (show && hopDongId) {
            fetchContractData();
        }
    }, [show, hopDongId]);

    const fetchContractData = async () => {
        let res = await fetchContractById(hopDongId);
        if (res && res.EC === 0) {
            setContract(res.DT);
        } else {
            toast.error(res.EM);
        }
    }
    
    const handlePrint = () => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');

        if (!printWindow) {
            alert('Vui lòng cho phép popup để in!');
            return;
        }

        const content = printRef.current.innerHTML;

        const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
        const stylesHTML = styles.map(node => node.outerHTML).join('\n');

        printWindow.document.write(`
            <html>
            <head>
                <title>In hợp đồng</title>
                ${stylesHTML}
            </head>
            <body>${content}</body>
            </html>
        `);

        printWindow.document.close();

        printWindow.focus();

        printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
        };
    }

    return (
        <Modal show={show} onHide={onClose} size="xl" centered>
        <Modal.Header closeButton>
            <Modal.Title>Chi tiết hợp đồng #{hopDongId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {contract ? (
                <div ref={printRef}>
                    <ContractPreview data={contract} ngayKT={contract.ngayKT} />
                </div>
            ) : (
                <p>Đang tải dữ liệu hợp đồng...</p>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>Đóng</Button>
            <Button variant="primary" onClick={() => handlePrint()}>In / Lưu PDF</Button>
        </Modal.Footer>
        </Modal>
    );
}

export default ModalContract;