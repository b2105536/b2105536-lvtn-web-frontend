import './Home.scss';
import React, { useEffect, useState } from 'react';
import { fetchAllHouses } from '../../services/homeService';

const Home = () => {
    const [listHouses, setListHouses] = useState([]);

    useEffect(() => {
        getHouses();
    }, []);

    const getHouses = async () => {
        let res = await fetchAllHouses();
        if (res && res.EC === 0) {
            setListHouses(res.DT);
        }
    };

    return (
        <div className="home-container container">
            <div className="home-header">
                <div className='title mt-3'>
                    <h3>Trang chủ</h3>
                </div>
                <hr />
                <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img src="/assets/images/img1.jpg" className="d-block w-100" alt="Ảnh 1" />
                        </div>
                        <div className="carousel-item">
                            <img src="/assets/images/img2.jpg" className="d-block w-100" alt="Ảnh 2" />
                        </div>
                        <div className="carousel-item">
                            <img src="/assets/images/img3.jpg" className="d-block w-100" alt="Ảnh 3" />
                        </div>
                        <div className="carousel-item">
                            <img src="/assets/images/img4.jpg" className="d-block w-100" alt="Ảnh 4" />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Trước</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Sau</span>
                    </button>
                </div>
            </div>
            <div className='home-body'>
                <div className='sub-title mt-3'>
                    <h4>Khám phá</h4>
                </div>
                <hr />
                {listHouses && listHouses.length > 0 ? (
                    <div className="row">
                        {listHouses.map((item, index) => (
                            <div className="col-6 mb-3" key={`list-house-${index}`}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{item.ten}</h5>
                                        <span className="card-text"><i className="fa fa-map-marker"></i>{item.diaChi}, {item.Xa.tenXa}, {item.Xa.Huyen.tenHuyen}, {item.Xa.Tinh.tenTinh}</span>
                                        <p className={`card-text ${!item.moTa || item.moTa.trim() === "" ? 'hidden-content' : ''}`}>
                                            <i className="fa fa-info-circle"></i>
                                            {item.moTa || ''}
                                        </p>
                                        <p className="card-text">
                                            <small className={`text-body-secondary ${item.tinhTrang === "Còn phòng" ? 'green' : 'red'}`}>{item.tinhTrang}</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div><span>Đang tải dữ liệu...</span></div>
                )}
            </div>
        </div>
    );
};

export default Home;
