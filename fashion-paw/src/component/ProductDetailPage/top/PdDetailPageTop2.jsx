import React, { Component } from 'react';
import PdImageGallery from './PdImageGallery.jsx'
import PdTitleMessage from './PdTitleMessage.jsx';
import AddToCartBtn from './AddToCartBtn.jsx';
import AddToMyFavorite from './AddToMyFavorite.jsx';
import ShareProducts from './ShareProductsBtn.jsx';
import PdTitle from './PdTitle.jsx';

class PdDetailPageTop extends Component {
  state = { };

  render() {
    return (
      <>
      <div className="container-fluid">
        <div className="row">
          <div className='col-md-2 border border-primary d-none d-md-block
'>a</div>
          <div className='col-md-8'>
              <PdTitle />
            <div className='d-flex flex-column flex-md-row'>
              <div className='d-flex align-items-center col-md-5'>
                {/* 左邊圖片 */}
                <PdImageGallery />
              </div>
              <div className='col-md-7 my-4'>
                {/* 右邊說明 */}
                <div>
                  <PdTitleMessage />
                </div>
                <div className='d-flex align-items-center flex-md-row  '>
                  <AddToCartBtn />

                <div className='d-flex align-items-center'>
                  <AddToMyFavorite />
                  <ShareProducts />
                </div>

                 
                </div>
              </div>

            </div>

            <div>
              BOTTOM



              
            </div>

          </div>
          <div className='border border-secondary col-md-2 d-none d-md-block
'>c</div>
        </div>

      </div>

      

      </>
    );
  }
}

export default PdDetailPageTop;