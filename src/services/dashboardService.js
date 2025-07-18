// import axios from "axios";
import axios from '../setup/axios';

const fetchTotalUsersByGroup = () => {
    return axios.get('/api/v1/dashboard/user-stats-by-group');
}

const fetchTotalStudentsByGender = () => {
    return axios.get('/api/v1/dashboard/student-stats-by-gender');
}

const fetchHousesByDistrict = () => {
    return axios.get('/api/v1/dashboard/house-stats-by-district');
}

const fetchHousesByOwner = () => {
    return axios.get('/api/v1/dashboard/house-stats-by-owner');
}

export {
    fetchTotalUsersByGroup,
    fetchTotalStudentsByGender,
    fetchHousesByDistrict,
    fetchHousesByOwner
 };