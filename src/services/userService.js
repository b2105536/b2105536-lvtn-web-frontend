// import axios from "axios";
import axios from '../setup/axios';

const registerNewUser = (soDienThoai, hoTen, email, matKhau) => {
    return axios.post('/api/v1/register', {
        soDienThoai, hoTen, email, matKhau
    });
}

const loginUser = (valueLogin, matKhau) => {
    return axios.post('/api/v1/login', {
        valueLogin, matKhau
    });
}

const fetchAllUsers = (page, limit, nhomId = 'ALL') => {
    return axios.get(`/api/v1/user/read?page=${page}&limit=${limit}&nhomId=${nhomId}`);
}

const deleteUser = (user) => {
    return axios.delete('/api/v1/user/delete', {data: {id: user.id}});
}

const fetchGroup = () => {
    return axios.get('/api/v1/group/read');
}

const createNewUser = (userData) => {
    return axios.post('/api/v1/user/create', {...userData});
}

const updateCurrentUser = (userData) => {
    return axios.put('/api/v1/user/update', {...userData});
}

const getUserAccount = () => {
    return axios.get('/api/v1/account');
}

const logoutUser = () => {
    return axios.post('/api/v1/logout');
}

const changePassword = (data) => {
    return axios.post('/api/v1/user/change-password', data);
};

export {
    registerNewUser,
    loginUser,
    fetchAllUsers,
    deleteUser,
    fetchGroup,
    createNewUser,
    updateCurrentUser,
    getUserAccount,
    logoutUser,
    changePassword
 };