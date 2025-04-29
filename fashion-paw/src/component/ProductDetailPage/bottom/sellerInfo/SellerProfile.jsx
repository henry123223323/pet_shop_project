import React, { Component } from 'react';
class SellerProfile extends Component {
    state = {
    }
    render() {
        return (<>

            {/* 賣家基本資料 */}

            <div className="container mx-1 ">
                <div className="row">
                    {/* 左邊：大頭貼＋總評價聯絡我，並排 */}
                    <div className="col-12 col-md-6 d-flex mb-3">
                        {/* 大頭貼 */}
                        <div className="d-flex justify-content-center align-items-center me-3">
                            <img
                                className="rounded"
                                src="media/pet_know/pet_feeding/cat/petfeedingb_1.jpeg"
                                alt="大頭貼"
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    objectFit: 'cover',
                                    objectPosition: 'center center',
                                }}
                            />
                        </div>

                        {/* 總評價＋聯絡 */}
                        <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                            <div className="border border-primary text-center rounded w-75 mb-2">總評價</div>
                            <div className="border border-primary text-center rounded w-75 mb-2">
                                4星<span className="ptxt5">（3）</span>
                            </div>
                            <div className="btn paw-btn-middlebrown w-75" onClick={this.contact}>
                                聯絡我
                            </div>
                        </div>
                    </div>

                    {/* 下方：關於賣家 */}
                    <div className="col-md-6 rounded p-3">
                        <div>
                            <p>
                                <span>上次登錄時間：</span> <span>2025-04-09 03:33:20</span>
                            </p>
                            <div>
                                <p className='ptxtb4'>關於毛🐱主人</p>
                                <p className='px-3 '>
                                    熱愛毛孩生活，分享家中用不到但保存良好的寵物用品，希望能讓更多小動物享受舒適生活。
                                    商品皆細心清潔整理，誠信交易，歡迎喜歡的朋友來訊聊聊！
                                </p>
                            </div>
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