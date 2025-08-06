import axios from '../setup/axios';

const getPaymentInfo = async (email) => {
    return await axios.get(`/api/v1/payment/info-by-email?email=${email}`);
};

const createZaloPayOrder = async (amount, email, hoaDonId) => {
    return await axios.post('/api/v1/payment/zalopay/create-order', {
        amount,
        email,
        hoaDonId
    });
};

const fetchAllInvoices = (email) => {
    return axios.get(`/api/v1/invoice/read?email=${email}`);
};

const fetchDetailInvoice = (hoaDonId) => {
    return axios.get(`/api/v1/invoice/${hoaDonId}`);
};

const fetchAllBookings = (email) => {
    return axios.get(`/api/v1/bookings?email=${email}`);
};

const deleteBooking = (bookingId, email) => {
    return axios.post(`/api/v1/booking/delete`, { bookingId, email });;
};

export {
    getPaymentInfo,
    createZaloPayOrder,
    fetchAllInvoices,
    fetchDetailInvoice,
    fetchAllBookings,
    deleteBooking
}