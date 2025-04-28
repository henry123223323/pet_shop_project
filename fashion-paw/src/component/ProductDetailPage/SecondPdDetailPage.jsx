import React, { Component } from 'react';
//top
import PdImageGallery from './top/PdImageGallery.jsx'
import PdTitleMessage from './top/PdTitleMessage.jsx';
import AddToCartBtn from './top/AddToCartBtn.jsx';
import AddToMyFavorite from './top/AddToMyFavorite.jsx';
import ShareProducts from './top/ShareProductsBtn.jsx';
import PdTitle from './top/PdTitle.jsx';
import PdQuantity from './top/PdQuantity.jsx';
//bottom
import SwitchPage from './bottom/SwitchPage.jsx';
import PdInfo from './bottom/pdInfo/PdInfo.jsx';
import SellerInfo from './bottom/sellerInfo/SellerInfo.jsx';

class PdDetailPage extends Component {
  state = {
    currentPage: "description",
  };

  render() {
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            {/* 左 */}
            <div className='col-md-2 border border-primary d-none d-md-block'>a</div>

            {/* 中 */}
            <div className='col-md-8 '>

              <div className='paw-bg-lightenbrown p-2'>
                <div className='mx-4'><PdTitle /></div>
                <div className='d-flex flex-column flex-md-row '>
                  <div className='d-flex align-items-center col-md-5'>
                    {/* 左邊圖片 */}
                    <PdImageGallery />
                  </div>
                  <div className='col-md-7 my-4'>
                    {/* 右邊說明 */}
                    <div>
                      <PdTitleMessage />
                    </div>

                    <div className='d-flex align-items-center flex-md-row flex-wrap'>
                      <PdQuantity />

                      <div className='d-flex align-items-center'>
                        <AddToCartBtn type="text" />
                        <AddToMyFavorite />
                        <ShareProducts />
                      </div>


                    </div>
                  </div>
                </div>

              </div>
              {/* 下半部 */}
              <div>
                <SwitchPage
                  currentPage={this.state.currentPage}
                  changePage={(click) => { this.setState({ currentPage: click }) }} />

                {this.state.currentPage === "description" ? <PdInfo /> : <SellerInfo />}
              </div>
            </div>

            {/* 右 */}
            <div className='border border-secondary col-md-2 d-none d-md-block'>c</div>
          </div>

        </div>
      </>
    );
  }
}

export default PdDetailPage;