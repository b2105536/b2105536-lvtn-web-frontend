import axios from '../setup/axios';

const fetchContractById = (hopDongId) => {
    return axios.get(`/api/v1/manage/contract/${hopDongId}`);
}

const updateContract = (hopDongId, data) => {
    return axios.put(`/api/v1/manage/contract/update/${hopDongId}`, data);
}

export {
    fetchContractById,
    updateContract
}