import React from 'react';
import banner from '../PetKnowledge/images/selectbirdv2.png'
// import slider component (e.g. react-slick or swiper) 這裡先用 div 佔位
function Banner() {
  return (
    <div className="banner-carousel">
      {/* TODO: 用輪播套件取代下面三張圖 */}
      <div className="slide"><img src={banner} alt="" style={{width:500}} /></div>
      <div className="slide">Banner 2</div>
      <div className="slide">Banner 3</div>
    </div>
  );
}
export default Banner;
