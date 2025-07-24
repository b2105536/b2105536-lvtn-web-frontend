import axios from '../setup/axios';

const getPaymentInfo = async (email) => {
    return await axios.get(`/api/v1/payment/info-by-email?email=${email}`);
};

export {
    getPaymentInfo
}