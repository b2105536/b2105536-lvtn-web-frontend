import axios from '../setup/axios';

const fetchAllHouses = () => {
    return axios.get('/api/v1/home/get-house');
}

export {
    fetchAllHouses
 };