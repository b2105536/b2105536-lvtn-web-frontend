import axios from '../setup/axios';

const fetchHousesByOwner = (email) => {
    return axios.get(`/api/v1/manage/house-by-email?email=${email}`);
}

const fetchRoom = (nhaId) => {
    return axios.get(`/api/v1/manage/room-by-house?nhaId=${nhaId}`);
}

const createOrLinkTenant = (data) => {
    return axios.post('/api/v1/manage/student/create', data);
};

const deleteContract = (hopDongId, phongId) => {
    return axios.delete('/api/v1/manage/student/delete', {
        data: {
            hopDongId,
            phongId
        }
    });
};

export {
    fetchHousesByOwner,
    fetchRoom,
    createOrLinkTenant,
    deleteContract
}