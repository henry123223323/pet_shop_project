import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

class Profile extends Component {
    state = {
<<<<<<< HEAD
        showModal: false,
        photo: ""
=======
        showModal: false
>>>>>>> test
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    }

    componentDidMount() {
        //去資料庫抓username email 大頭照 生日 電話......
        // 自動帶入編輯裡的資料
    }
<<<<<<< HEAD
    PhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const photoURL = URL.createObjectURL(file);
            this.setState({
                photo: photoURL
            });
        }
    }
=======

>>>>>>> test
    render() {
        const { showModal } = this.state;

        return (
            <>
                <h2>個人檔案</h2>
                <button className="btn btn-primary" onClick={this.toggleModal}>編輯</button>

                <div className=" border fs-4 border-danger mt-3 p-3">
                    <label className='pb2'>用戶名稱:</label>
                    <span className='p2'>username</span><br />
                    <label className='pb2'>電子信箱:</label>
                    <span className='p2'>email</span><br />
                    <label className='pb2'>大頭照:</label>
                    <img style={{ borderRadius: "100%", width: "80px" }} src="/media/member_center/cat.jpg" alt="" /><br />
                    <label className='pb2'>生日:</label>
                    <span className='p2'>2025/1/1</span>
                    <p></p>
                    <label className='pb2'>電話:</label>
                    <span className='p2'>0426222356</span>
                </div>

                {/* Bootstrap Modal */}
                {showModal && (
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                                        <input type="text" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>大頭照</label>
<<<<<<< HEAD
                                        <input type="file" className="form-control" onChange={this.PhotoChange} />
                                        <img width={100} src={this.state.photo} alt="大頭照" />
=======
                                        <input type="file" className="form-control" />
                                        <img src="" alt="大頭照" />
>>>>>>> test
                                        {/* 這裡顯示選擇的圖片 */}
                                    </div>
                                    <div className="form-group">
                                        <label>電子信箱</label>
                                        <input type="email" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>生日</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                    <div className="form-group">
                                        <label>電話</label>
                                        <input type='phone' className="form-control" />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={this.toggleModal}>取消</button>
                                    <button type="button" className="btn btn-primary">儲存變更</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default Profile;
