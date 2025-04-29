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
      count:1,
      products: [
        {
          pid: "sc01",
          condition: "second",
          status: 1,
          pet_type: "貓",
          pd_name: "灰色毛氈立方貓窩（可折疊）",
          price: "199",
          description: "這款立方造型的毛氈貓窩，原本是為家中小貓準備的...",
          categories: "貓用品",
          city: "台中市",
          district: "南屯區",
          uid: "user1234",
          new_level: "3",
          stock: "1",
          sale_count: "0",
          delivery_method: ["面交", "宅配", "超商取貨"],
          attribute: {
            brand: "無品牌",
            name: "灰色毛氈貓窩",
            model: "立方折疊款",
            purchase_date: "2024/03",
            condition_level: "良好",
            size: "約長38cm × 寬38cm × 高38cm（展開）",
            color: "灰色",
            weight: "約1kg（含墊子）"
          },
          images: [
            { img_path: "/media/second_pd/cat/cat2_home1_1.jpeg", img_value: "整體正面照，展示貓窩與坐墊" },
            { img_path: "/media/second_pd/cat/cat2_home1_2.jpeg", img_value: "貓窩側面展示，明顯可見進出口圓洞" },
            { img_path: "/media/second_pd/cat/cat2_home1_3.jpeg", img_value: "俯視角度，展示上方圓形入口設計" },
            { img_path: "/media/second_pd/cat/cat2_home1_4.jpeg", img_value: "貓窩折疊收納狀態，附上坐墊" }
          ]
        },
        {
          pid: "np01",
          condition: "new",
          status: 1,
          pet_type: "貓",
          pd_name: "加厚耐抓雙面貓抓板",
          price: "599",
          description: "全新加厚款雙面貓抓板，採用高密度瓦楞紙製作...",
          categories: "居家用品",
          uid: "user5678",
          stock: "10",
          sale_count: "0",
          delivery_method: ["宅配", "超商取貨"],
          attribute: {
            brand: "毛小孩日常",
            name: "雙面貓抓板",
            model: "加厚耐抓版",
            size: "長45cm × 寬22cm × 厚4cm",
            color: "棕色",
            weight: "約500g"
          },
          images: [
            { img_path: "/media/new_pd/cat/livingEssentials/cat1_scratch1_1.jpg", img_value: "貓抓板整體外觀展示" },
            { img_path: "/media/new_pd/cat/livingEssentials/cat1_scratch1_2.jpg", img_value: "展示雙面可使用設計" },
            { img_path: "/media/new_pd/cat/livingEssentials/cat1_scratch1_3.jpg", img_value: "附贈天然貓薄荷包裝示意" },
            { img_path: "/media/new_pd/cat/livingEssentials/cat1_scratch1_4.jpg", img_value: "貓咪實際使用情境圖" }
          ]
        }
      ],
      currentProductIndex: 1, // 目前要顯示第幾個商品（初始先顯示第1筆）
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
                <div className='mx-4'>
                  <PdTitle 
                    pdname={this.state.products[this.state.currentProductIndex].pd_name}/>
                </div>
                <div className='d-flex flex-column flex-md-row '>
                  <div className='d-flex align-items-center col-md-5'>
                    {/* 左邊圖片 */}
                    <PdImageGallery 
                      images={this.state.products[this.state.currentProductIndex].images}/>
                  </div>
                  <div className='col-md-7 my-4'>
                    {/* 右邊說明 */}
                    <div>
                      <PdTitleMessage 
                        condition={this.state.products[this.state.currentProductIndex].condition}
                        pid={this.state.products[this.state.currentProductIndex].pid}
                        categories={this.state.products[this.state.currentProductIndex].categories}
                        price={this.state.products[this.state.currentProductIndex].price}
                        stock={this.state.products[this.state.currentProductIndex].stock}
                        deliveryMethod={this.state.products[this.state.currentProductIndex].delivery_method}
                        brand={this.state.products[this.state.currentProductIndex].attribute.brand}
                        city={this.state.products[this.state.currentProductIndex].city}
                        district={this.state.products[this.state.currentProductIndex].district}
                        newLevel={this.state.products[this.state.currentProductIndex].new_level}
                        />
                    </div>

                    <div className='d-flex align-items-center flex-md-row flex-wrap'>
                      <PdQuantity 
                      quantity={this.state.count}
                      onQuantityChange={(newQty) => this.setState({ count: newQty })}/>

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