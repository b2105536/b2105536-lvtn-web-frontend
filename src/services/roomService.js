import axios from '../setup/axios';

const fetchAllRooms = (page, limit, nhaId = 'ALL', ttPhongId = 'ALL', giaThueTu = '', giaThueDen = '') => {
    return axios.get(`/api/v1/room/read`, {
        params: {
            page,
            limit,
            nhaId,
            ttPhongId,
            giaThueTu,
            giaThueDen
        }
    });
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

const updateCurrentRoom = (roomData) => {
    return axios.put('api/v1/room/update', {...roomData});
}

const fetchRoomStatus = () => {
    return axios.get('/api/v1/allcode/stat-rooms');
}

const fetchRentRange = () => {
    return axios.get('/api/v1/room/rent-range');
}

export {
    fetchAllRooms,
    deleteRoom,
    fetchHouse,
    fetchState,
    createNewRoom,
    updateCurrentRoom,
    fetchRoomStatus,
    fetchRentRange
};