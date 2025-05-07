import React, { Component } from 'react';
import PawDisplay from '../../PawDisplay';


class NReview extends Component {

  render() {
    const { review } = this.props
    return (<>
      {/* 評論區 */}
      <div>
        {review.length > 0 ? review.map((item, index) => (
          <div key={index} className={`shadow-sm rounded ${index % 2 === 0 ? 'paw-bg-middlebrown' : 'paw-bg-pri-darkbrown'} p-3 my-3`}>
           <div className='d-flex justify-content-between'>

           <div>
              <span className='ptxtb4'>{item.username}</span>
              <span className='mx-3'><PawDisplay rating={item.rating} /></span>
            </div>
            <div className='mb-2'>{formatDate(item.create_time)}</div>

           </div>
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
const formatDate = (isoString) => {
  const date = new Date(isoString);
  const pad = (n) => n.toString().padStart(2, '0');

  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());

  return `${y}-${m}-${d} ${h}:${min}:${s}`;
};
export default NReview;