// import axios from "axios";
import axios from '../setup/axios';

const fetchAllHouses = (page, limit) => {
    return axios.get(`/api/v1/house/read?page=${page}&limit=${limit}`);
}

const deleteHouse = (house) => {
    return axios.delete('/api/v1/house/delete', {data: {id: house.id}});
}

const fetchUser = () => {
    return axios.get('/api/v1/house/user-by-group');
}

const fetchProvince = () => {
    return axios.get('/api/v1/house/province');
}

const fetchDistrictsByProvince = (tinhId) => {
    return axios.get(`/api/v1/house/district/by-province/${tinhId}`);
}

const fetchWardsByDistrict = (huyenId) => {
    return axios.get(`/api/v1/house/ward/by-district/${huyenId}`);
}

const createNewHouse = (houseData) => {
    return axios.post('/api/v1/house/create', {...houseData});
}

const updateCurrentHouse = (houseData) => {
    return axios.put('/api/v1/house/update', {...houseData});
}

export {
    fetchAllHouses,
    deleteHouse,
    fetchUser,
    createNewHouse,
    updateCurrentHouse,
    fetchProvince,
    fetchDistrictsByProvince,
    fetchWardsByDistrict
 };