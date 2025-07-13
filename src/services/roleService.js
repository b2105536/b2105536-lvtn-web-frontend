import axios from '../setup/axios';

const createRoles = (roles) => {
    return axios.post('/api/v1/role/create', [...roles]);
}

const fetchRole = () => {
    return axios.get('/api/v1/role/read');
}

const fetchAllRoles = (page, limit) => {
    return axios.get(`/api/v1/role/read?page=${page}&limit=${limit}`);
}

const deleteRole = (role) => {
    return axios.delete('/api/v1/role/delete', {data: {id: role.id}});
}

const updateCurrentRole = (roleData) => {
    return axios.put('/api/v1/role/update', {...roleData});
}

const fetchRolesByGroup = (nhomId) => {
    return axios.get(`/api/v1/role/by-group/${nhomId}`);
}

export {
    createRoles,
    fetchRole,
    fetchAllRoles,
    deleteRole,
    updateCurrentRole,
    fetchRolesByGroup
};