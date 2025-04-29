import React, { Component } from 'react';
class NReview extends Component {

    render() { 
        const {review}=this.props
        return ( <>
        {/* 評論區 */}
        <div>
          {review.length > 0 ? review.map((item, index) => (
            <div key={index} className={`shadow-sm rounded ${index % 2 === 0 ? 'paw-bg-middlebrown' : 'paw-bg-pri-darkbrown'} p-3 m-4`}>
              <div>
                <span className='ptxtb4'>{item.uid}</span> 
                <span className='mx-3'>{"❤️".repeat(item.rating)}</span>
              </div>
              <div className='mb-2'>{item.create_time}</div>
              <div>
                <div className='ptxtb4 pb-1'>評論：</div>
                <span>{item.comment}</span>
              </div>
            </div>
          )) : <div className="p-4">尚無評論</div>}
        </div>
      </>);
    }

}
 
export default NReview;