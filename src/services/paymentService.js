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

export {
    getPaymentInfo,
    createZaloPayOrder
}