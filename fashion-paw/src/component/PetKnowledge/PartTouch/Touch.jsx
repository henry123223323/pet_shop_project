import React, { Component } from 'react';
class Touch extends Component {
    state = {}
    render() {
        return (
            <div className="container-xl">
                <h1 className='paw-bg-primary'>部位碰碰看</h1>
                <label htmlFor="next">狗狗</label>
                <button id='next'>▶️</button>
                <img src="" alt="" />
                <p></p>
                <p></p>
                <h4>耳朵</h4>
                <hr />
                <div>
                    <p>狗狗耳朵容易藏汙納垢，要定期清潔耳朵</p>
                </div>
                <h6 className="text-xl font-semibold mt-10 mb-4">｜或許你適合...</h6>

                <div className="container mb-5">
                    <div className="row g-4">
                        {["點心罐", "純湯罐", "無膠肉罐"].map((name, index) => (
                            <div key={index} className=" col">
                                <div className="border rounded-lg p-3 shadow-md mx-2">
                                    <div className="text-center mb-2">
                                        <img src="" alt="測試 hamster" className="img-fluid" style={{ width: '100px', height: 'auto', objectFit: 'cover' }} />
                                    </div>
                                    <p className="text-sm">商品名稱: {name}</p>
                                    <p className="text-sm">價格: 80元</p>
                                    <a href="#!" className="btn btn-warning text-white rounded">加入購物車</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Touch;