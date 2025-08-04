import axios from '../setup/axios';

const fetchAllHouses = () => {
    return axios.get('/api/v1/home/get-house');
}

const fetchHouseDetailById = (id) => {
    return axios.get(`/api/v1/home/house/house-detail/${id}`);
}

export {
    fetchAllHouses,
    fetchHouseDetailById
};