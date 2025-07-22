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

// Services:
const createServices = (services) => {
    return axios.post('/api/v1/manage/service/create', [...services]);
}

const fetchAllServices = (page, limit) => {
    return axios.get(`/api/v1/manage/service/read?page=${page}&limit=${limit}`);
}

const deleteService = (service) => {
    return axios.delete('/api/v1/manage/service/delete', {data: {id: service.id}});
}

const updateCurrentService = (serviceData) => {
    return axios.put('/api/v1/manage/service/update', {...serviceData});
}

// Modal Service
const fetchService = () => {
    return axios.get('/api/v1/manage/service/read');
}

const fetchContract = () => {
    return axios.get('/api/v1/manage/contract/read');
}

const fetchServicesByContract = (hopDongId) => {
    return axios.get(`/api/v1/manage/service/by-contract/${hopDongId}`);
}

const assignServicesToContract = (data) => {
    return axios.post('/api/v1/manage/service/assign', {data});
}

export {
    fetchHousesByOwner,
    fetchRoom,
    createOrLinkTenant,
    deleteContract,
    createServices,
    fetchAllServices,
    deleteService,
    updateCurrentService,
    fetchService,
    fetchContract,
    fetchServicesByContract,
    assignServicesToContract
}