import React, { Component } from 'react';
import cookie from "js-cookie";
import axios from 'axios';

// import 'bootstrap/dist/css/bootstrap.min.css';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.inputname = React.createRef();
        this.inputemail = React.createRef();
        this.inputbirthday = React.createRef();
        // this.inputphone = React.createRef();
        this.inputphoto = React.createRef();

        this.state = {
            showModal: false,
            photo: "",
            uid: "",
            username: ""
        }
    }

    handleSave = () => {
        const file = this.inputphoto.current.files[0]
        const formData = new FormData();

        if (file) {
            formData.append("photo", file);
        }

        formData.append("uid", cookie.get("user_uid"))
        formData.append("username", this.inputname.current.value);
        formData.append("email", this.inputemail.current.value);
        formData.append("birthday", this.inputbirthday.current.value);
        // formData.append("phone", this.inputphone.current.value);



        axios.post("http://localhost:8000/post/edituserinfo", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })


        this.setState({ showModal: !this.state.showModal },()=>{this.getuserinfo()});
        

    }




    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }
    tooglePasswordModal = () => {
        this.setState({ PasswordModal: !this.state.PasswordModal });



    getuserinfo = () => {
        const uid = cookie.get("user_uid");  // 獲取 cookie 中的 uid
        if (uid) {
            console.log("UID from cookie:", uid);  // 確認是否獲得了 uid


            // 使用正確的 URL 格式來發送請求
            axios.get(`http://localhost:8000/get/userinfo/${uid}`)
                .then(response => {
                    // 處理後端回傳的資料
                    // console.log(response.data.photo);
                    // console.log(response.data);  // 假設這裡是返回的使用者資料
                    // 在這裡進行自動帶入資料
                    // const photoBuffer = response.data.results[0].photo.data;
                    // const user = response.data.results[0];
                    // const photoBase64 = `data:image/png;base64,${Buffer.from(user.photo.data).toString('base64')}`;

                    const user = response.data
                    const photoBase64 = user.photo;  // 直接使用後端返回的 Base64 字串
                    console.log(photoBase64);
                    console.log(response.data.username);




                    this.setState({
                        uid: response.data.uid,
                        username: response.data.username,
                        email: response.data.email,
                        birthday: response.data.birthday,
                        photo: photoBase64
                    })
                    // console.log(response.data.results[0]);
                })
                .catch(error => {
                    console.error("發送請求錯誤:", error);
                });
        } else {
            console.log("沒有找到 uid cookie");
        }

        } else {
            console.log("沒有找到 uid cookie");
        }

    }








    componentDidMount() {
        this.getuserinfo()
    }
    //去資料庫抓username email 大頭照 生日 電話......
    // 自動帶入編輯裡的資料
    PhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const photoURL = URL.createObjectURL(file);
            this.setState({
                photo: photoURL
            });
        }
    }
    render() {
        const { showModal, PasswordModal } = this.state;

        return (
            <>
                <h2>個人檔案</h2>
                <button className="btn btn-primary" onClick={this.toggleModal}>編輯</button>
                <button className="btn btn-primary" onClick={this.tooglePasswordModal}>變更密碼</button>
                <div className=" border fs-4 border-danger mt-3 p-3">
                    <label className='pb2'>用戶名稱:</label>
                    <span className='p2'>{this.state.username}</span><br />
                    <label className='pb2'>電子信箱:</label>
                    <span className='p2'>{this.state.email}</span><br />
                    <label className='pb2'>大頭照:</label>
                    {this.state.photo && (
                        <img src={this.state.photo} alt="User Profile" style={{ borderRadius: "100%", width: "80px" }} />
                    )}<br />

                    <label className='pb2'>生日:</label>
                    <span className='p2'>{this.state.birthday}</span>

                </div>

                {/* Bootstrap Modal */}
                {PasswordModal && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">變更密碼</h5>
                                    <button type="button" className="close btn" onClick={this.tooglePasswordModal}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <label htmlFor="">輸入密碼:</label>
                                    <input type="text" />
                                    <p></p>
                                    <label htmlFor="">再次輸入密碼:</label>
                                    <input type="text" />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.tooglePasswordModal}>取消</button>
                                    <button type="button" className="btn btn-primary">儲存變更</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showModal && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">編輯個人檔案</h5>
                                    <button type="button" className="close btn" onClick={this.toggleModal}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>用戶名稱</label>
                                        <input type="text" className="form-control" ref={this.inputname} />
                                    </div>
                                    <div className="form-group">
                                        <label>大頭照</label>
                                        <input type="file" className="form-control" onChange={this.PhotoChange} ref={this.inputphoto} />
                                        <img width={100} src={this.state.photo} alt="大頭照" />
                                        {/* 這裡顯示選擇的圖片 */}
                                    </div>
                                    <div className="form-group">
                                        <label>電子信箱</label>
                                        <input type="email" className="form-control" ref={this.inputemail} />
                                    </div>
                                    <div className="form-group">
                                        <label>生日</label>
                                        <input type="date" className="form-control" ref={this.inputbirthday} />
                                    </div>
                                    {/* <div className="form-group">
                                        <label>電話</label>
                                        <input type='phone' className="form-control" ref={this.inputphone} />
                                    </div> */}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.toggleModal}>取消</button>
                                    <button type="button" className="btn btn-primary" onClick={this.handleSave} >儲存變更</button>
                                </div>
                            </div>
                        </div>
                    </div >
                )
                }
            </>
        );
    }
}

export default Profile;
