import React, { Component } from 'react';
import style from './SReview.module.css'
class SReview extends Component {
    state = { 
        commentState : false,
     } 
    render() { 
        const {commentState} = this.state
        const {review}=this.props
        return (<>
        {/* <h1>賣家評論</h1> */}
 
            {/* 按鈕-展開評論 */}
            <div className={`my-3 btn paw-btn-outline-pri-darkgreen d-flex flex-fill justify-content-between ${commentState === true ? style.btnClicking : ""}`}
            onClick={this.commentShow}>
                <div>對賣家的評論</div>
                <div >
                    
                    <i className={`bi ${commentState === true ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>
                </div>
            </div>
            {/* 評論區 */}
            <>
        {/* 評論區 */}
        {commentState && <div>
          {review.length > 0 ? review.map((item, index) => (
            <div key={index} className={`shadow-sm rounded ${index % 2 === 0 ? 'paw-bg-middlebrown' : 'paw-bg-pri-darkbrown'} p-3 m-4`}>
              <div className='d-flex justify-content-between'>
                <div>
                    <span className='ptxtb4'>{item.uid}</span> 
                    <span className='mx-3'>{"❤️".repeat(item.rating)}</span>
                </div>
                <div className='mb-2'>{item.create_time}</div>
              </div>

              <div className='mb-2'>
                <span className='ptxtb4'>購買商品：</span>
                <span>{item.product_name}</span>
              </div>
              <div>
                <div className='ptxtb4 pb-1'>評論：</div>
                <span>{item.comment}</span>
              </div>
            </div>
          )) : <div className="p-4">尚無評論</div>}
        </div>}
      </>

        </>);
    }
    commentShow = () => {
        // alert("click")
        this.setState({commentState : !this.state.commentState})
    }
}
 
export default SReview;