import axios from '../setup/axios';


const fetchAllRooms = (page, limit) => {
    return axios.get(`/api/v1/room/read?page=${page}&limit=${limit}`);
}

const deleteRoom = (room) => {
    return axios.delete('/api/v1/room/delete', {data: {id: room.id}});
}

const fetchHouse = () => {
    return axios.get('/api/v1/room/house-read');
}

const fetchState = (type) => {
    return axios.get(`/api/v1/allcode?loai=${type}`);
}

const createNewRoom = (roomData) => {
    return axios.post('/api/v1/room/create', {...roomData});
}

export {
    fetchAllRooms,
    deleteRoom,
    fetchHouse,
    fetchState,
    createNewRoom
};