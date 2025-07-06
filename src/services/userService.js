import axios from "axios";

const registerNewUser = (soDienThoai, hoTen, email, matKhau) => {
    return axios.post('http://localhost:8080/api/v1/register', {
        soDienThoai, hoTen, email, matKhau
    });
}

export { registerNewUser };