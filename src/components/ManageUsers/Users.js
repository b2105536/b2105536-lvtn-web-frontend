import { useEffect, useState } from 'react';
import './Users.scss';
import { fetchAllUsers } from '../../services/userService';
import { set } from 'lodash';

const Users = (props) => {
    const [listUsers, setListUsers] = useState([]);
    
    useEffect (() => {
        fetchUsers() ;
    }, []);

    const fetchUsers = async () => {
        let response = await fetchAllUsers();

        if (response && response.data && response.data.EC === 0) {
            setListUsers(response.data.DT);
            console.log(response.data.DT)
        }
    }

    return (
        <div className='container'>
            <div className='manage-users-container'>
                <div className='user-header'>
                    <div className='title'>
                        <h3>Bảng Người Dùng</h3>
                    </div>
                    <div className='actions'>
                        <button className='btn btn-success'>Làm mới</button>
                        <button className='btn btn-primary'>Thêm người dùng</button>
                    </div>
                </div>
                <div className='user-body'>
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                            <th scope="col">STT</th>
                            <th scope="col">ID</th>
                            <th scope="col">Số điện thoại</th>
                            <th scope="col">Họ tên</th>
                            <th scope="col">Email</th>
                            <th scope="col">Nhóm người dùng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listUsers && listUsers.length > 0 ?
                                    <>
                                        {listUsers.map((item, index) => {
                                            return (
                                                <tr key={`row-${index}`}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.id}</td>
                                                    <td>{item.soDienThoai}</td>
                                                    <td>{item.hoTen}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.NhomND ? item.NhomND.tenNhom : ''}</td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                :
                                    <><span>Không tìm thấy người dùng.</span></>
                            }
                        </tbody>
                    </table>
                </div>
                <div className='user-footer'>
                    <nav aria-label="Page navigation example">
                        <ul class="pagination">
                            <li class="page-item"><a class="page-link" href="#">Trước</a></li>
                            <li class="page-item"><a class="page-link" href="#">1</a></li>
                            <li class="page-item"><a class="page-link" href="#">2</a></li>
                            <li class="page-item"><a class="page-link" href="#">3</a></li>
                            <li class="page-item"><a class="page-link" href="#">Sau</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
}

export default Users;