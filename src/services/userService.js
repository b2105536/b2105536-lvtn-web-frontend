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

const fetchAllUsers = (page, limit) => {
    return axios.get(`/api/v1/user/read?page=${page}&limit=${limit}`);
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

export {
    registerNewUser,
    loginUser,
    fetchAllUsers,
    deleteUser,
    fetchGroup,
    createNewUser,
    updateCurrentUser
 };