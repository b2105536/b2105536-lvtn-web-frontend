import axios from '../setup/axios';

const addToBlacklist = (data) => {
    return axios.post('/api/v1/manage/blacklist/add', data);
}

const unblockStudent = (sinhVienId) => {
    return axios.delete(`/api/v1/manage/blacklist/remove/${sinhVienId}`);
}

export {
    addToBlacklist,
    unblockStudent
}