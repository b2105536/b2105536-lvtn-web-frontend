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

export {
    fetchHousesByOwner,
    fetchRoom,
    createOrLinkTenant
}