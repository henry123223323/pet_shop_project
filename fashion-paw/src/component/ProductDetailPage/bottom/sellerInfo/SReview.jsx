import React, { Component } from 'react';
import style from './SReview.module.css'
class PdInfo extends Component {
    state = { 
        commentState : false,
     } 
    render() { 
        const {commentState} = this.state
        return (<>
        <h1>賣家評論</h1>
 
            {/* 按鈕-展開評論 */}
            <div className={`btn paw-btn-outline-pri-darkgreen d-flex flex-fill justify-content-between ${commentState === true ? style.btnClicking : ""}`}
            onClick={this.commentShow}>
                <div>對賣家的評論</div>
                <div >
                    
                    <i className={`bi ${commentState === true ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>
                </div>
            </div>
            {/* 評論區 */}
            <div 
            style={commentState ? {display:"inline"} :{display:"none"}}>
                {/* 1 */}
                <div className='shadow-sm rounded paw-bg-middlebrown p-3 m-4'>
                    <div>
                        <span className='ptxtb4'>小橘貓</span> <span className='mx-3'>❤️❤️❤️❤️❤️</span>
                    </div>
                    <div className=' mb-2'>2025-04-02 09:33:20</div>
                    <div className='mb-2'>
                        <span className='ptxtb4'>購買產品：</span>
                        <span>柔軟絨布狗狗墊</span></div>
                    <div>
                        <div className='ptxtb4 pb-1'>評論：</div>
                        <span>商品跟描述的一樣新，賣家回覆超快，包裝也很細心，非常推薦！</span></div>

                </div>

                {/* 2 */}
                <div className='shadow-sm rounded paw-bg-pri-darkbrown p-3 m-4'>
                    <div>
                        <span className='ptxtb4'>小橘貓</span> <span className='mx-3'>❤️❤️❤️❤️❤️</span>
                    </div>
                    <div className=' mb-2'>2025-04-02 09:33:20</div>
                    <div className='mb-2'>
                        <span className='ptxtb4'>購買產品：</span>
                        <span>柔軟絨布狗狗墊</span></div>
                    <div>
                        <div className='ptxtb4 pb-1'>評論：</div>
                        <span>商品跟描述的一樣新，賣家回覆超快，包裝也很細心，非常推薦！</span></div>

                </div>

                {/* 3 */}
                <div className='shadow-sm rounded paw-bg-middlebrown p-3 m-4'>
                    <div className='mb-2'>
                        <span className='ptxtb4'>小橘貓</span> <span className='mx-3'>❤️❤️❤️❤️❤️</span>
                    </div>
                    <div className=' mb-2'>2025-04-02 09:33:20</div>
                    <div className='mb-2'>
                        <span className='ptxtb4'>購買產品：</span>
                        <span>柔軟絨布狗狗墊</span></div>
                    <div>
                        <div className='ptxtb4 pb-1'>評論：</div>
                        <span>商品跟描述的一樣新，賣家回覆超快，包裝也很細心，非常推薦！</span></div>

                </div>
            </div>

        </>);
    }
    commentShow = () => {
        // alert("click")
        this.setState({commentState : !this.state.commentState})
    }
}
 
export default PdInfo;