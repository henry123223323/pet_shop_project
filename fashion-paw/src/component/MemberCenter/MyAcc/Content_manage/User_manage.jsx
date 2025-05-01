import React, { Component } from 'react';
import Pagination from './Page_manage';
class User_manage extends Component {
    state = {
        show: false,
        thisIndex: 0,
        currentPage: 1,
        editinguser: {
            uid: "",
            username: "",
            email: "",
            fullname: "",
            birthday: "",
            power: "",//enum('developer', 'seller', 'buyer')
            last_time_login: "",
            aboutme: "",
            device: "",
            photo: ""
        },
        userinfo: [
            {
                uid: "1",
                username: "henry1",
                email: "cat@gmail.com",
                fullname: "柯 景承",
                birthday: "2020/1/1",
                power: "developer",//enum('developer', 'seller', 'buyer')
                last_time_login: "2025/04/28 上午10:12:08",
                aboutme: "你好",
                device: "/5SDDG6B",
                photo: "./cat.jpg"
            },
            {
                uid: "2",
                username: "henry2",
                email: "cat@gmail.com",
                fullname: "柯 景成",
                birthday: "2020/1/21",
                power: "seller",//enum('developer', 'seller', 'buyer')
                last_time_login: "2025/04/28 上午10:12:08",
                aboutme: "你好嗎",
                device: "/5SDWW6B",
                photo: "./catfood.jpg"
            }
        ]
    }
    handlePageChange = (page) => {
        this.setState({ currentPage: page });
    };
    Renderpower = (power) => {
        if (power === "developer") {
            return '開發者'
        }
        else if (power === "seller") {
            return '賣家'
        }
        else if (power === "buyer") {
            return '買家'
        }
    }
    toggleModal = () => {
        this.setState({ show: !this.state.show });
    }
    render() {
        let { userinfo, show, editinguser, currentPage } = this.state
        let itemsPerPage = 1
        let startIndex = (currentPage - 1) * itemsPerPage;
        let currentuser = userinfo.slice(startIndex, startIndex + itemsPerPage);
        return (
            <>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>使用者編號</th>
                            <th>使用者暱稱</th>
                            <th>姓名</th>
                            <th>生日</th>
                            <th>上次登入</th>
                            <th>網站權限</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentuser.map((user, index) => {
                                return (
                                    <tr>
                                        <td>{user.uid}</td>
                                        <td>{user.username}</td>
                                        <td>{user.fullname}</td>
                                        <td>{user.birthday}</td>
                                        <td>{user.last_time_login}</td>
                                        <td>{this.Renderpower(user.power)}</td>
                                        <td><button className='btn btn-primary' onClick={() => this.EditUser(index)}>編輯</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>




                </table>
                <Pagination
                    totalItems={userinfo.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={this.handlePageChange}
                />
                {
                    show && (
                        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                            <div className="modal-dialog">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5 className="modal-title">編輯會員資料</h5>
                                        <button type="button" className="btn-close" onClick={this.toggleModal}></button>
                                    </div>

                                    <form onSubmit={this.handleSubmit}>
                                        <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                                            <div className="mb-3">
                                                <label className="form-label">使用者名稱</label>
                                                <input type="text" className="form-control" name="username" value={editinguser.username} onChange={this.handleChange} />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">電子郵件</label>
                                                <input type="email" className="form-control" name="email" value={editinguser.email} onChange={this.handleChange} />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">全名</label>
                                                <input type="text" className="form-control" name="fullname" value={editinguser.fullname} onChange={this.handleChange} />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">生日</label>
                                                <input type="date" className="form-control" name="birthday" value={editinguser.birthday} onChange={this.handleChange} />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">權限</label>
                                                <select className="form-control" name="power" value={editinguser.power} onChange={this.handleChange}>
                                                    <option value="developer">開發者</option>
                                                    <option value="seller">賣家</option>
                                                    <option value="buyer">買家</option>
                                                </select>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">上次登入時間</label>
                                                <input type="text" className="form-control" name="last_time_login" value={editinguser.last_time_login} onChange={this.handleChange} disabled />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">關於我</label>
                                                <textarea className="form-control" name="aboutme" value={editinguser.aboutme} onChange={this.handleChange}></textarea>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">發票載具</label>
                                                <input type="text" className="form-control" name="device" value={editinguser.device} onChange={this.handleChange} />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">大頭照:</label>
                                                <input type="file" name="" id="" onChange={this.handlePhotoChange} />
                                                <img src={this.state.editinguser.photo} width={100} alt="大頭照" />
                                            </div>

                                        </div>

                                        <div className="modal-footer">
                                            <button type="submit" className="btn btn-primary">儲存變更</button>
                                            <button type="button" className="btn btn-secondary" onClick={this.toggleModal}>取消</button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    )}
            </>
        );
    }
    // componentDidUpdate() {
    //     console.log(this.state.editinguser);

    // }
    handleSubmit = (event) => {
        event.preventDefault()
        this.toggleModal()
        console.log(this.state.editinguser);

        //資料庫update
    }
    handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const photoURL = URL.createObjectURL(file);
            this.setState(prevState => ({
                editinguser: {
                    ...prevState.editinguser,
                    photo: photoURL
                }
            }));
        }
    }
    handleChange = (event) => {
        let key = event.target.name
        let { editinguser } = this.state
        let newUserInfo = { ...editinguser }
        newUserInfo[`${key}`] = event.target.value
        this.setState({ editinguser: newUserInfo })
        console.log(this.state.editinguser);
    }
    EditUser = (index) => {
        let selectedUser = { ...this.state.userinfo[index] };
        this.setState({
            show: true,
            thisIndex: index,
            editinguser: selectedUser
        });
    }

}

export default User_manage;