import axios from '../setup/axios';

const fetchAllHouses = () => {
    return axios.get('/api/v1/home/get-house');
}

const fetchHouseDetailById = (id) => {
    return axios.get(`/api/v1/home/house/house-detail/${id}`);
}

const fetchBookingRoomDetail = (roomId) => {
    return axios.get(`/api/v1/home/house/booking/${roomId}`);
}

const confirmBooking = (roomId, formData, userId) => {
    return axios.post('/api/v1/home/booking', {
        roomId,
        formData,
        userId
    });
}

export {
    fetchAllHouses,
    fetchHouseDetailById,
    fetchBookingRoomDetail,
    confirmBooking
};