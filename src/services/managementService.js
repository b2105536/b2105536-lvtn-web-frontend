import axios from '../setup/axios';

const fetchHousesByOwner = (email) => {
    return axios.get(`/api/v1/manage/house-by-email?email=${email}`);
};

const fetchRoom = (nhaId) => {
    return axios.get(`/api/v1/manage/room-by-house?nhaId=${nhaId}`);
};

const createOrLinkTenant = (data) => {
    return axios.post('/api/v1/manage/student/create', data);
};

const terminateContract = (hopDongId, phongId) => {
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
};

const fetchAllServices = (page, limit) => {
    return axios.get(`/api/v1/manage/service/read?page=${page}&limit=${limit}`);
};

const deleteService = (service) => {
    return axios.delete('/api/v1/manage/service/delete', {data: {id: service.id}});
};

const updateCurrentService = (serviceData) => {
    return axios.put('/api/v1/manage/service/update', {...serviceData});
};

// Modal Service
const fetchService = () => {
    return axios.get('/api/v1/manage/service/read');
};

const fetchContract = () => {
    return axios.get('/api/v1/manage/contract/read');
};

const fetchServicesByContract = (hopDongId) => {
    return axios.get(`/api/v1/manage/service/by-contract/${hopDongId}`);
};

const assignServicesToContract = (data) => {
    return axios.post('/api/v1/manage/service/assign', {data});
};

// Modal Invoice
const fetchInvoiceData = (hopDongId) => {
    return axios.get(`/api/v1/manage/invoice/by-contract/${hopDongId}`);
};

const fetchShowInvoiceData = (hopDongId) => {
    return axios.get(`/api/v1/manage/invoice/show/${hopDongId}`);
};

const saveInvoice = (data) => {
    return axios.post('/api/v1/manage/invoice/create', { data });
};

// Modal Confirm Invoice
const getInvoiceDataByContract = (hopDongId) => {
    return axios.get(`/api/v1/manage/invoice/read/${hopDongId}`);
};

const saveInvoicePayment = (data) => {
    return axios.post('/api/v1/manage/invoice/update', { data });
};

// Revenue:
const fetchListInvoices = (houseId, page, limit) => {
    return axios.get(`/api/v1/manage/revenue/list-invoices?houseId=${houseId}&page=${page}&limit=${limit}`);
};

const fetchRevenueByTime = (houseId, type) => {
    return axios.get(`/api/v1/manage/revenue/chart?houseId=${houseId}&type=${type}`);
};

// Modal Edit Room
const updateRoomInfo = (data) => {
    return axios.put('/api/v1/manage/room/update', data);
};

const fetchStudentInfo = (roomId) => {
    return axios.get(`/api/v1/manage/room/student-info?phongId=${roomId}`);
};

// Modal Edit House
const updateHouseInfo = (data) => {
    return axios.put('/api/v1/manage/house/update', data);
};

export {
    fetchHousesByOwner,
    fetchRoom,
    createOrLinkTenant,
    terminateContract,
    createServices,
    fetchAllServices,
    deleteService,
    updateCurrentService,
    fetchService,
    fetchContract,
    fetchServicesByContract,
    assignServicesToContract,
    fetchInvoiceData,
    saveInvoice,
    fetchShowInvoiceData,
    getInvoiceDataByContract,
    saveInvoicePayment,
    fetchListInvoices,
    fetchRevenueByTime,
    updateRoomInfo,
    fetchStudentInfo,
    updateHouseInfo
}