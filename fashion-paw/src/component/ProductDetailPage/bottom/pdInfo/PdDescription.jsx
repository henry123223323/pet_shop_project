import React, { Component } from 'react';
class PdDescription extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [
                {
                    src: '/media/second_pd/cat/cat2_home1_1.jpeg',
                    description: '俯視角度，展示上方圓形入口設計'
                },
                {
                    src: '/media/second_pd/cat/cat2_home1_2.jpeg',
                    description: '貓窩側面展示，明顯可見進出口圓洞'
                },
                {
                    src: '/media/second_pd/cat/cat2_home1_3.jpeg',
                    description: '整體正面照，展示貓窩與坐墊'
                },
                {
                    src: '/media/second_pd/cat/cat2_home1_4.jpeg',
                    description: '貓窩折疊收納狀態，附上坐墊'
                }
            ]
        };
    }



    render() {
        return (<>
            {/* <h1>我是商品說明</h1> */}

            <div className="container-fluid">
                <div>
                    <p className="ptxtb4">割愛原因：</p>
                    <p>這款立方造型的毛氈貓窩，原本是為家中小貓準備的，但因毛孩較少使用，現以二手良品出清。貓窩採用柔軟毛氈材質，觸感舒適，附有灰色坐墊，厚實柔軟，依然保存良好。
                        可折疊收納，節省空間，非常適合需要機動佈置的小家庭。
                        希望能找到新的毛孩小主人繼續好好利用！</p>
                </div>

                <div>
                    <p className="ptxtb4">詳細狀態：</p>
                    <div className="row">
                        {this.state.images.map((img, index) => (
                            <div className="col-12 col-md-6 mb-4 text-center" key={index}>
                                <img src={img.src} alt={`商品圖片 ${index + 1}`} className="img-fluid mb-2" />
                                <p>{img.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

 
        </>);
    }
}

export default PdDescription;