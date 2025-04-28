import React, { Component } from 'react';
//top
import PdImageGallery from './top/PdImageGallery.jsx'
import PdTitleMessage from './top/PdTitleMessage.jsx';
import AddToCartBtn from '../share/AddToCartBtn.jsx';
import AddToMyFavorite from '../share/AddToMyFavorite.jsx';
import ShareProducts from './top/ShareProductsBtn.jsx';
import PdTitle from './top/PdTitle.jsx';
import PdQuantity from '../share/PdQuantity.jsx';
//bottom
import SwitchPage from './bottom/SwitchPage.jsx';
import PdInfo from './bottom/pdInfo/PdInfo.jsx';
import SellerInfo from './bottom/sellerInfo/SellerInfo.jsx';

class PdDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "description",
      isFavorite: false,
      isShare: false,
    };
  }    

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
                        <AddToCartBtn type="text" onClick={this.addToCart} />
                        <AddToMyFavorite 
                            onClick={this.favBtnClick} 
                            isFavorite={this.state.isFavorite}
                            size="24px"
                            type="icon"/>
                        <ShareProducts 
                            onClick={this.shareOthers}
                            isShare={this.state.isShare}/>
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
  addToCart = () => {
    alert("要連購物車！")
  }
  favBtnClick = (e) => {
    alert('已收藏')
    this.setState((prevState) => ({
      isFavorite: !prevState.isFavorite,
    }));
  }
  shareOthers = async () => {
    try {
    // 複製網址
      await navigator.clipboard.writeText(window.location.href); 
      this.setState({ isShare: true });

      setTimeout(() => {
        this.setState({ isShare: false });
      }, 1000);
    } catch (err) {
      console.error('複製失敗', err);
    }
  };
}

export default PdDetailPage;