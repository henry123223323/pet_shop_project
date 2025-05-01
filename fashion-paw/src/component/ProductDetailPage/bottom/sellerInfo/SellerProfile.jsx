import React, { Component } from 'react';
class SellerProfile extends Component {

    render() {
        const { userProfile, avgRating, ratingCount } = this.props
        return (<>

            {/* 賣家基本資料 */}

            <div className="container mx-1 ">
                <div className="row">
                    <div>


                    </div>
                    {/* 左邊：大頭貼＋總評價聯絡我，並排 */}
                    <div className="col-12 col-md-6 d-flex flex-column align-items-center mb-3">
                        {/* 大頭貼 */}
                        <div className="mb-3">
                            <img
                                className="rounded img-fluid"
                                src={userProfile.photo}
                                alt="大頭貼"
                                style={{
                                    maxWidth: '250px', // 最大寬度限制
                                    width: '100%',
                                    height: 'auto', // 保持比例
                                    objectFit: 'cover',
                                    objectPosition: 'center center',
                                }}
                            />
                        </div>

                        {/* 總評價＋聯絡我（橫排） */}
                        <div className="d-flex justify-content-center w-100">
                            <div className="border border-primary text-center rounded  px-3">
                                {avgRating === "還沒有評價" ? "還沒有評價" : `${avgRating}星`}
                                <span className="ptxt5">({ratingCount})</span>
                            </div>
                            <div className="btn paw-btn-middlebrown" onClick={this.contact}>
                                聯絡我
                            </div>
                        </div>
                    </div>

                    {/* 下方：關於賣家 */}
                    <div className="col-md-6 rounded p-3">
                        <div>
                            <div>
                                <p className='ptxtb4'>關於{userProfile.username}</p>
                                <p className='px-3 '>
                                    {userProfile.AboutMe}
                                </p>
                            </div>
                            <p>
                                <span className='ptxtb4'>上次登錄時間：</span> <span>{userProfile.last_time_login}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>);
    }
    contact = () => {
        alert("click")
    }
}

export default SellerProfile;