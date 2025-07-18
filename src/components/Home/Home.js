import { useEffect, useState } from 'react';
import './Home.scss';
import { fetchTotalUsersByGroup,
        fetchTotalStudentsByGender,
        fetchHousesByDistrict,
        fetchHousesByOwner } from '../../services/dashboardService';
import { Pie, Bar } from 'react-chartjs-2';
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

const Home = (props) => {
    const [userGroupChart, setUserGroupChart] = useState(null);
    const [genderChart, setGenderChart] = useState(null);
    const [houseByDistrictChart, setHouseByDistrictChart] = useState(null);
    const [houseByOwnerChart, setHouseByOwnerChart] = useState(null);

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
    }, []);

    return (
        <div className="home-container container">
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
                <div className='mt-3'></div>
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
            </div>
        </div>
    );
}

export default Home;