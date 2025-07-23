const formatDateVN = (inputDate) => {
    const date = new Date(inputDate);
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));

    const dd = String(tzDate.getDate()).padStart(2, '0');
    const mm = String(tzDate.getMonth() + 1).padStart(2, '0');
    const yyyy = tzDate.getFullYear();
    const hh = String(tzDate.getHours()).padStart(2, '0');
    const min = String(tzDate.getMinutes()).padStart(2, '0');
    const ss = String(tzDate.getSeconds()).padStart(2, '0');

    return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
};

const removeVietnameseTones = (str) => {
    return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/Đ/g, "D")
        .toUpperCase();
};

export { formatDateVN, removeVietnameseTones };