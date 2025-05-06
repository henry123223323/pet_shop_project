import React, { Component } from 'react';
import axios from 'axios';
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
import NReview from './bottom/pdInfo/NReview.jsx';
import NewSideBar from '../ProductPage/SideBar/SideBar.jsx';
import SeSideBar from '../SeProductPage/SideBar/SideBar.jsx';
import HotRanking from '../ProductPage/HotRanking/HotRanking.jsx';
import { CartContext } from 'component/Cart/CartContext.jsx';

class PdDetailPage extends Component {
  static contextType = CartContext;
  constructor(props) {
    super(props);
    this.state = {
      currentPage: "description",
      isFavorite: false,
      isShare: false,
      count: 1,
      product: null,
      sellerInfo: {},
      review: [],
      loading: true,
      error: null,
    }
  }

  render() {
    //目前商品
    const currentPd = this.state.product;
    if (this.state.loading) return <div>載入中...</div>;
    if (this.state.error || !currentPd) return <div>{this.state.error || "找不到商品"}</div>;
    //目前商品的賣家資訊
    // const userProfile = this.state.userinfo.find(user => user.uid === currentPd.uid);
    const userProfile = this.state.sellerInfo || {
      uid: currentPd.uid,
      username: '賣家',
      photo: ''
    };

    //屬於這個商品賣家的所有評論
    const sellerReview = this.state.review.filter(review => review.pid === currentPd.pid);
    //評價總分
    const totalRating = sellerReview.reduce((sum, review) => sum + review.rating, 0)
    //平均分數
    const avgRating = sellerReview.length > 0 ? (totalRating / sellerReview.length).toFixed(2) : "還沒有評價";
    //評價數量
    const ratingCount = sellerReview.length


    //新品的評價
    const newPdReview = this.state.review.filter((review) => review.pid === currentPd.pid)
    //新品評價總分
    const newTotalRating = newPdReview.reduce((sum, review) => sum + review.rating, 0)
    //新品平均分數
    const newAvgRating = newPdReview.length > 0 ? (newTotalRating / newPdReview.length).toFixed(2) : "還沒有評價";
    //新品評價數量
    const newRatingCount = newPdReview.length

    return (
      <>
        <div className="container-fluid">
          <div className="row">
            {/* 左 */}
            <div className='col-md-2 border border-primary d-none d-md-block'>
              {/* 導入動物+商品種類篩選 */}
              {currentPd.condition === "new" ? <NewSideBar /> : <SeSideBar />}

            </div>

            {/* 中 */}
            <div className={currentPd.condition === "new" ? "col-md-8" : "col-md-10"}>
              {/* 上半部 */}
              <div className='paw-bg-lightenbrown p-2'>
                <div className='mx-4'>
                  <PdTitle
                    pdname={currentPd.pd_name} />
                </div>
                <div className='d-flex flex-column flex-md-row '>
                  <div className='d-flex align-items-center col-md-5'>
                    {/* 左邊圖片 */}
                    <PdImageGallery
                      images={currentPd.images} />
                  </div>
                  <div className='col-md-7 my-4'>
                    {/* 右邊說明 */}
                    <div>
                      <PdTitleMessage
                        condition={currentPd.condition}
                        pid={currentPd.pid}
                        categories={currentPd.categories}
                        price={currentPd.price}
                        stock={currentPd.stock}
                        brand={currentPd.attribute.brand}
                        city={currentPd.city}
                        district={currentPd.district}
                        newLevel={currentPd.new_level}
                        newAvgRating={newAvgRating}
                        newRatingCount={newRatingCount}
                      />
                    </div>
                    {/* 數量調整 */}
                    <div className='d-flex align-items-center flex-md-row flex-wrap'>
                      <PdQuantity
                        quantity={this.state.count}
                        max={parseInt(currentPd.stock)}
                        onQuantityChange={(newQty) => this.setState({ count: newQty })} />
                      {/* 加入購物車、收藏、分享 */}
                      <div className='d-flex align-items-center'>
                        <AddToCartBtn type="text" onClick={this.addToCart} />
                        <AddToMyFavorite
                          onClick={this.favBtnClick}
                          isFavorite={this.state.isFavorite}
                          size="24px"
                          type="icon" />
                        <ShareProducts
                          onClick={this.shareOthers}
                          isShare={this.state.isShare} />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              {/* 下半部 */}
              <div>
                <SwitchPage
                  currentPage={this.state.currentPage}
                  changePage={(click) => { this.setState({ currentPage: click }) }}
                  condition={currentPd.condition} />

                {this.state.currentPage === "description" ?
                  <PdInfo
                    condition={currentPd.condition}
                    description={currentPd.description}
                    images={currentPd.images}
                    pdAttr={currentPd.attribute} /> : (currentPd.condition === "new" ?
                      <NReview
                        review={this.state.review.filter(r => r.pid === currentPd.pid)} />
                      :
                      <SellerInfo
                        userProfile={userProfile}
                        review={this.state.review.filter(r => r.pid === currentPd.pid)}
                        avgRating={avgRating}
                        ratingCount={ratingCount}
                        sellerOtherPd={this.state.sellerOtherPd} />)}
              </div>
            </div>

            {/* 右，商品是新品時顯示熱門排行 */}
            {currentPd.condition === "new" ? <><div className='border border-secondary col-md-2 d-none d-md-block'><HotRanking /></div></> : ""}

          </div>

        </div>
      </>
    );
  }

  componentDidMount() {
    const { pid } = this.props;
    const { setSellers } = this.context;
  
    let product = null;
    let sellerInfo = null;
  
    // 撈商品
    axios.get(`http://localhost:8000/productslist/${pid}`)
      .then(res => {
        product = res.data;
        this.setState({ product });
        return axios.get(`http://localhost:8000/get/userinfo`);
      })
      .then(res => {
        const allUsers = res.data;
        // console.log("商品 UID：", product.uid);
  
        // 找出對應的使用者
        sellerInfo = allUsers.find(user => String(user.uid) === String(product.uid));
        // console.log("賣家資訊：", sellerInfo);
  
        if (sellerInfo) {
          this.setState({
            sellerInfo: {
              ...sellerInfo,
              photoUrl: `http://localhost:8000/userphoto/${sellerInfo.uid}`
            }
          });
        } else {
          console.warn("找不到對應的賣家資訊");
          this.setState({
            sellerInfo: {},
          });
        }
  
        // 撈賣家其他商品
        return axios.get(`http://localhost:8000/sellerOtherPd/${product.uid}/${product.pid}`);
      })
      .then(res => {
        this.setState({
          sellerOtherPd: res.data,
          loading: false
        });
        // console.log(res.data)
      })
      .catch(err => {
        console.error("載入資料失敗", err);
        this.setState({ error: "找不到商品或賣家", loading: false });
      })
      .finally(() => {
        // ✅ 給 context
        if (setSellers && sellerInfo) {
          setSellers([{
            uid: sellerInfo?.uid,
            username: sellerInfo?.username || "未命名賣家",
            photo: `http://localhost:8000/userphoto/${sellerInfo?.uid || ''}`
          }]);
        }
      });
  }

  addToCart = async () => {
    const { addToCart } = this.context;
    const currentPd = this.state.product;
    const cartItem = {
      ...currentPd,
      quantity: this.state.count
    };

    const result = await addToCart(cartItem); // ⬅️ 等待結果
    if (result === 'new' || result === 'updated') {
      const go = window.confirm("已加入購物車！是否前往查看？");
      if (go) {
        window.location.href = '/ShoppingCartPage';
      }
    }
  };

  favBtnClick = (e) => {
    // alert('已收藏')
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
