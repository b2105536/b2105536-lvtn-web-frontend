import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchService, fetchServicesByContract, assignServicesToContract } from '../../services/managementService';
import { Modal, Button } from 'react-bootstrap';

const ModalService = (props) => {
    const { show, handleClose, contractId } = props;

    const [listServices, setListServices] = useState([]);
    const [assignServices, setAssignServices] = useState([]);

    useEffect (() => {
        if (contractId) {
            getAllServices();
        }
    }, [contractId]);

    const getAllServices = async () => {
        let serviceRes = await fetchService();
        if (serviceRes && +serviceRes.EC === 0) {
            setListServices(serviceRes.DT);

            let contractRes = await fetchServicesByContract(contractId);
            if (contractRes && +contractRes.EC === 0) {
                let result = buildDataServicesByContract(contractRes.DT.DichVus, serviceRes.DT);
                setAssignServices(result);
            }
        }
    }

    const buildDataServicesByContract = (contractServices, allServices) => {
        return allServices.map(service => ({
            ...service,
            isAssigned: contractServices.some(item => item.tenDV === service.tenDV)
        }));
    }

    const handleSelectService = (id) => {
        setAssignServices(prev =>
            prev.map(s => s.id === +id ? { ...s, isAssigned: !s.isAssigned } : s)
        );
    }

    const handleSave = async () => {
        const contractServices = assignServices
            .filter(s => s.isAssigned)
            .map(s => ({ hopDongId: +contractId, dichVuId: +s.id }));
        const res = await assignServicesToContract({ hopDongId: +contractId, contractServices });
        if (res && res.EC === 0) {
            toast.success(res.EM);
            handleClose();
        } else {
            toast.error(res.EM);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="sm">
            <Modal.Header closeButton>
                <Modal.Title>Dịch vụ sử dụng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {assignServices.map((item, index) => (
                    <div className="form-check" key={index}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value={item.id}
                            id={`service-${index}`}
                            checked={item.isAssigned}
                            onChange={(e) => handleSelectService(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor={`service-${index}`}>
                            {item.tenDV} ({item.donViTinh})
                        </label>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                <Button variant="primary" onClick={handleSave}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalService;