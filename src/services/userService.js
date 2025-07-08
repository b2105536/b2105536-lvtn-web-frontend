import axios from "axios";

const registerNewUser = (soDienThoai, hoTen, email, matKhau) => {
    return axios.post('http://localhost:8080/api/v1/register', {
        soDienThoai, hoTen, email, matKhau
    });
}

const loginUser = (valueLogin, matKhau) => {
    return axios.post('http://localhost:8080/api/v1/login', {
        valueLogin, matKhau
    });
}

const fetchAllUsers = (page, limit) => {
    return axios.get(`http://localhost:8080/api/v1/user/read?page=${page}&limit=${limit}`);
}

const deleteUser = (user) => {
    return axios.delete('http://localhost:8080/api/v1/user/delete', {data: {id: user.id}});
}

export {
    registerNewUser,
    loginUser,
    fetchAllUsers,
    deleteUser
 };