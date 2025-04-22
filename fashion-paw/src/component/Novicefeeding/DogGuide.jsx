import React, { Component } from 'react';
import hamster from './img/Gotte.jpg';

class DogGuide extends Component {
    state = {}
    render() {
        console.log('hamster的路徑是: ', hamster);

        return (
            // <h1>ㄚㄚㄚㄚㄚ</h1>
            <div className="container-xl">
                {/* Banner Image */}
                <div className="text-center mt-5 mb-4 border"><img src={hamster} alt="測試 hamster" className="img-fluid" style={{ width: '600px', height: 'auto', objectFit: 'cover' }} /></div>

                {/* Article */}
                <div className="max-w-4xl mx-auto py-10 px-4">
                    <h3 className="text-3xl font-bold text-center mb-2 bg-warning">如何養狗狗</h3>
                    {/* 假日期，之後會fetch後端資料顯示上傳時間 */}
                    <p className="text-center text-sm text-gray-500 mb-6">{new Date().toLocaleDateString()}
                    </p>
                    <p className="mb-4">
                        你以為狗狗整天只會吃飯、睡覺、發呆嗎？其實，你家的毛小孩每天可是有超級多事情要處理！以下是我們根據一隻名叫「胖虎」的狗狗所觀察到的一整天生活紀錄：
                    </p>
                    <section className="mb-6">
                        <h5 className="border border-5 border-warning border-top-0 border-start-0 border-end-0 text-center">
                            ｜早上：起床＋巡邏
                        </h5>
                        <button className='btn btn-outline-primary'>測試按鈕</button>
                        <p>
                            早上 6 點整，胖虎就開始在家中四處走動，確認地板上沒有敵人、窗外的貓沒靠太近。昨天沒吃完的飼料還在不在。之後他會挑一個最舒服的位置坐下來盯著人類吃早餐，眼神裡充滿疑問：「我咧？」
                        </p>
                    </section>
                    <section className="mb-6">
                        <h5 className="border text-center">｜早上：起床＋巡邏</h5>
                        <p>
                            早上 6 點整，胖虎就開始在家中四處走動，確認地板上沒有敵人、窗外的貓沒靠太近。昨天沒吃完的飼料還在不在。之後他會挑一個最舒服的位置坐下來盯著人類吃早餐，眼神裡充滿疑問：「我咧？」
                        </p>
                    </section>

                    {/* 下一篇文章 */}
                    <div className="text-right mt-8 text-sm">
                        下一篇》狗狗飼養環境
                    </div>

                    {/* 推薦商品 */}
                    <h6 className="text-xl font-semibold mt-10 mb-4">｜或許你適合...</h6>

                    <div className="container mb-5">
                        <div className="row g-4">
                            {["點心罐", "純湯罐", "無膠肉罐"].map((name, index) => (
                                <div key={index} className=" col">
                                    <div className="border rounded-lg p-3 shadow-md mx-2">
                                        <div className="text-center mb-2">
                                            <img src={hamster} alt="測試 hamster" className="img-fluid" style={{ width: '100px', height: 'auto', objectFit: 'cover' }} />
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
            </div>
        );
    }
}

export default DogGuide;