import axios from '../setup/axios';

const fetchRoomsCashflow = (houseId) => {
    return axios.get(`/api/v1/manage/cashflow?houseId=${houseId}`);
}

const updateDeposit = (roomId, newDeposit) => {
    return axios.put('/api/v1/manage/cashflow/update-deposit', {
        roomId,
        tienDatCoc: newDeposit
    });
}

const payDebt = (roomId, amount) => {
    return axios.put('/api/v1/manage/cashflow/pay-debt', { roomId, amount });
}

export {
    fetchRoomsCashflow,
    updateDeposit,
    payDebt
}