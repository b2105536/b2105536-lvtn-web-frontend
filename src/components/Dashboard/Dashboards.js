import { useEffect, useState } from 'react';
import './Dashboards.scss';
import { fetchTotalUsersByGroup,
        fetchTotalStudentsByGender,
        fetchHousesByDistrict,
        fetchHousesByOwner,
        fetchRevenueStats } from '../../services/dashboardService';
import { fetchHouse } from '../../services/roomService';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboards = (props) => {
    const [userGroupChart, setUserGroupChart] = useState(null);
    const [genderChart, setGenderChart] = useState(null);
    const [houseByDistrictChart, setHouseByDistrictChart] = useState(null);
    const [houseByOwnerChart, setHouseByOwnerChart] = useState(null);

    const [chartType, setChartType] = useState('line');
    const [listHouses, setListHouses] = useState([]);
    const [houseId, setHouseId] = useState('all');
    const [timeType, setTimeType] = useState('month');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
    });
    const [chartData, setChartData] = useState(null);

    useEffect (() => {
        fetchTotalUsersByGroup().then((res) => {
            if (res && res.EC === 0) {
                const labels = res.DT.map(item => item.nhom);
                const values = res.DT.map(item => item.soNguoi);
                const colors = labels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));
            
                setUserGroupChart({
                    labels,
                    datasets: [
                        {
                            label: 'Số người dùng',
                            data: values,
                            backgroundColor: colors,
                        }
                    ]
                });
            }
        }).catch(err => console.error(err));

        fetchTotalStudentsByGender().then((res) => {
            if (res && res.EC === 0) {
            const data = res.DT;
            const labels = Object.keys(data);
            const values = Object.values(data);
            const colors = labels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));

            setGenderChart({
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: colors,
                    }
                ]
                });
            }
        }).catch(err => console.error(err));

        fetchHousesByDistrict().then((res) => {
            if (res && res.EC === 0) {
                const labels = res.DT.map(item => item.huyen);
                const values = res.DT.map(item => item.soNhaTro);
                const colors = labels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));
            
                setHouseByDistrictChart({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: colors,
                        }
                    ]
                });
            }
        }).catch(err => console.error(err));

        fetchHousesByOwner().then((res) => {
            if (res && res.EC === 0) {
                const labels = res.DT.map(item => item.chuSoHuu);
                const values = res.DT.map(item => item.soNhaTro);
                const colors = labels.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));
            
                setHouseByOwnerChart({
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: colors,
                        }
                    ]
                });
            }
        }).catch(err => console.error(err));

        fetchHouse().then((res) => {
            if (res && res.EC === 0) {
                setListHouses(res.DT);
            }
        }).catch(err => console.error(err));
    }, []);

    useEffect (() => {
        let payload = {
            type: timeType,
            fromDate: fromDate.toISOString().slice(0, 10),
            toDate: toDate.toISOString().slice(0, 10),
        };

        if (houseId !== 'all') {
            payload.nhaId = houseId;
        }

        fetchRevenueStats(payload).then((res) => {
            if (res && res.EC === 0) {
                setChartData({
                    labels: res.DT.labels,
                    datasets: [{
                        label: 'Doanh thu (VNĐ)',
                        data: res.DT.data,
                        backgroundColor: 'rgba(75,192,192,0.2)',
                        borderColor: 'rgba(75,192,192,1)',
                        borderWidth: 2,
                        fill: true
                    }]
                });
            }
        }).catch(err => console.error(err));
    }, [houseId, timeType, fromDate, toDate]);

    const getTimeLabel = () => {
        switch (timeType) {
            case 'day': return 'Thời gian (ngày)';
            case 'week': return 'Thời gian (tuần)';
            case 'month': return 'Thời gian (tháng)';
            case 'year': return 'Thời gian (năm)';
            default: return 'Thời gian';
        }
    }

    const handleReset = () => {
        setChartType('line');
        setHouseId('all');
        setTimeType('month');

        let now = new Date();
        let nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        setFromDate(now);
        setToDate(nextMonth);
    }

    return (
        <div className="dashboards-container container">
            <div className="row mt-3">
                <div className="col-12">
                    <h3>Tống quan</h3>
                    <hr />
                </div>
                <div className="col-md-6">
                    <h5>Thống kê người dùng theo nhóm</h5>
                    {userGroupChart ? (
                        <div className='bar-chart-size'>
                            <Bar
                                data={userGroupChart}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                    ) : (
                        <div>Đang tải dữ liệu...</div>
                    )}
                </div>
                <div className="col-md-6">
                    <h5>Thống kê sinh viên theo giới tính</h5>
                    {genderChart ? (
                        <div className='pie-chart-size'>
                            <Pie
                                data={genderChart}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false
                                }}
                            />
                        </div>
                    ) : (
                        <div>Đang tải dữ liệu...</div>
                    )}
                </div>
                <div className="mt-3"></div>
                <div className="col-md-6">
                    <h5>Thống kê nhà trọ theo quận/huyện (Thành phố Cần Thơ)</h5>
                    {houseByDistrictChart ? (
                        <div className='pie-chart-size-m'>
                            <Pie
                                data={houseByDistrictChart}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {legend: {position: 'right'}}
                                }}
                            />
                        </div>
                    ) : (
                        <div>Đang tải dữ liệu...</div>
                    )}
                </div>
                <div className="col-md-6">
                    <h5>Thống kê nhà trọ theo chủ sở hữu</h5>
                    {houseByOwnerChart ? (
                        <div className='pie-chart-size-m'>
                            <Pie
                                data={houseByOwnerChart}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {legend: {position: 'right'}}
                                }}
                            />
                        </div>
                    ) : (
                        <div>Đang tải dữ liệu...</div>
                    )}
                </div>
                <div className="mt-3"></div>
                <div className="revenue-tracking">
                    <h5>Theo dõi tăng trưởng doanh thu của các nhà trọ theo mốc thời gian</h5>
                    <div className="filters row mb-3">
                        <div className="col-md-2">
                            <label><span className="red">*</span> Loại biểu đồ</label>
                            <select className="form-select" value={chartType} onChange={(e) => setChartType(e.target.value)}>
                                <option value="line">Đường</option>
                                <option value="bar">Cột</option>
                                <option value="horizontalBar">Thanh ngang</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label><span className="red">*</span> Nhà trọ</label>
                            <select className="form-select" value={houseId} onChange={(e) => setHouseId(e.target.value)}>
                                <option value="all">Tất cả</option>
                                {listHouses.length > 0 &&
                                    listHouses.map((item, index) => {
                                        return (
                                            <option key={`house-${index}`} value={item.id}>{item.ten}</option>
                                        );
                                    })
                                }
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label><span className="red">*</span> Thời gian</label>
                            <select className="form-select" value={timeType} onChange={(e) => setTimeType(e.target.value)}>
                                <option value="day">Ngày</option>
                                <option value="week">Tuần</option>
                                <option value="month">Tháng</option>
                                <option value="year">Năm</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label><span className="red">*</span> Từ ngày</label>
                            <input
                                type="date"
                                className="form-control"
                                value={fromDate.toISOString().slice(0, 10)}
                                onChange={(e) => setFromDate(new Date(e.target.value))}
                            />
                        </div>
                        <div className="col-md-2">
                            <label><span className="red">*</span> Đến ngày</label>
                            <input
                                type="date"
                                className="form-control"
                                value={toDate.toISOString().slice(0, 10)}
                                onChange={(e) => setToDate(new Date(e.target.value))}
                            />
                        </div>
                        <div className="col-md-1 d-flex align-items-end">
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleReset()}
                                title="Đặt lại bộ lọc"
                            >
                                <i className="fa fa-refresh"></i>
                            </button>
                        </div>
                    </div>

                    <div className="chart-container">
                        {chartData && chartData.labels.length > 0 ? (
                            chartType === 'line' ? (
                                <Line
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: getTimeLabel()
                                                }
                                            },
                                            y: {
                                                beginAtZero: true,
                                                title: {
                                                    display: true,
                                                    text: 'Doanh thu (VNĐ)'
                                                }
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <Bar
                                    key={chartType}
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        indexAxis: chartType === 'horizontalBar' ? 'y' : 'x',
                                        scales: {
                                            x: {
                                                title: {
                                                    display: true,
                                                    text: chartType === 'horizontalBar' ? 'Doanh thu (VNĐ)' : getTimeLabel()
                                                }
                                            },
                                            y: {
                                                title: {
                                                    display: true,
                                                    text: chartType === 'horizontalBar' ? getTimeLabel() : 'Doanh thu (VNĐ)'
                                                },
                                                beginAtZero: true
                                            }
                                        }
                                    }}
                                />
                            )
                        ) : (
                            <p>Không có dữ liệu doanh thu trong thời gian đã chọn.</p>
                        )}
                    </div>
                </div>
                <div className="mt-3"></div>
            </div>
        </div>
    );
}

export default Dashboards;