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
import NReview from './bottom/pdInfo/NReview.jsx';
import SideBar from '../ProductPage/SideBar/SideBar.jsx';

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
          description: "這款立方造型的毛氈貓窩，原本是為家中小貓準備的，但因毛孩較少使用，現以二手良品出清。貓窩採用柔軟毛氈材質，觸感舒適，附有灰色坐墊，厚實柔軟，依然保存良好。 可折疊收納，節省空間，非常適合需要機動佈置的小家庭。 希望能找到新的毛孩小主人繼續好好利用！",
          categories: "貓用品",
          city: "台中市",
          district: "南屯區",
          uid: "user1234",
          new_level: "3星",
          stock: "1",
          sale_count: "0",
          delivery_method: ["面交", "宅配", "超商取貨"],
          attribute: {
            brand: "無品牌",
            name: "灰色毛氈立方貓窩（可折疊）",
            model: "XA-123",
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
          description: "全新加厚款雙面貓抓板，採用高密度瓦楞紙製成，耐抓耐磨，雙面皆可使用，延長使用壽命。附贈天然貓薄荷，吸引貓咪主動磨爪，幫助紓壓、減少破壞家具。尺寸適中，適合各種年齡與體型的貓咪使用，是毛孩日常不可或缺的實用小物。",
          categories: "居家用品",
          uid: "user5678",
          stock: "10",
          sale_count: "0",
          delivery_method: ["宅配", "超商取貨"],
          attribute: {
            brand: "毛小孩日常",
            name: "加厚耐抓雙面貓抓板",
            model: "c-2102",
            size: "長45cm × 寬22cm × 厚4cm",
            color: "棕色",
            weight: "約500g"
          },
          images: [
            { img_path: "/media/new_pd/cat/livingEssentials/cat1_scratch1_1.jpg", img_value: "貓抓板整體外觀展示" },
            { img_path: "/media/new_pd/cat/livingEssentials/cat1_scratch1_4.jpg", img_value: "展示雙面可使用設計" },
            { img_path: "/media/new_pd/cat/livingEssentials/cat1_scratch1_3.jpg", img_value: "附贈天然貓薄荷包裝示意" },
            { img_path: "/media/new_pd/cat/livingEssentials/cat1_scratch1_2.jpg", img_value: "貓咪實際使用情境圖" }
          ]
        }
      ],
      review:[
        {
          "pid": "sc01",
          "product_name": "貓咪雞肉點心",
          "condition": "second",
          "uid": "小橘貓",
          "rating": 5,
          "comment": "商品跟描述的一樣新，賣家回覆超快，包裝也很細心，非常推薦！",
          "create_time": "2025-04-27 10:15:23"
        },
        {
          "pid": "sc01",
          "product_name": "增高飼料架",
          "condition": "second",
          "uid": "奇奇兔",
          "rating": 4,
          "comment": "收到商品速度很快，品質也不錯，唯一小小瑕疵是有些微使用痕跡。",
          "create_time": "2025-03-14 18:47:10"
        },
        {
          "pid": "sc01",
          "product_name": "狗狗玩具球",
          "condition": "second",
          "uid": "泡泡汪",
          "rating": 5,
          "comment": "價格很合理，商品乾淨，感覺賣家很用心整理過，狗狗很喜歡！",
          "create_time": "2025-02-06 22:03:45"
        },
        {
          "pid": "np01",
          "product_name": "加厚耐抓雙面貓抓板",
          "condition": "new",
          "uid": "咪咪寶",
          "rating": 5,
          "comment": "貓抓板很厚實，貓咪超愛，還會自己躺上去磨爪，非常滿意！",
          "create_time": "2025-04-15 12:30:55"
        },
        {
          "pid": "np01",
          "product_name": "加厚耐抓雙面貓抓板",
          "condition": "new",
          "uid": "胖虎喵",
          "rating": 4,
          "comment": "質感不錯，雙面設計很實用，只是貓薄荷包有點小。",
          "create_time": "2025-04-10 09:20:18"
        },
        {
          "pid": "np02",
          "product_name": "迷你攀爬貓樹",
          "condition": "new",
          "uid": "小花熊",
          "rating": 5,
          "comment": "超可愛的攀爬架，家裡小貓很快就學會爬上爬下，品質也很好！",
          "create_time": "2025-03-22 16:05:40"
        }
      ],
      currentPdIdx: 0, // 目前要顯示第幾個商品
    };
  }    

  render() {
    const currentPd = this.state.products[this.state.currentPdIdx]
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            {/* 左 */}
            <div className='col-md-2 border border-primary d-none d-md-block'>
              {currentPd.condition === "new" ? <SideBar/> : "a"}
              
            </div>

            {/* 中 */}
            <div className={currentPd.condition === "new" ?"col-md-8":"col-md-10"}>

              <div className='paw-bg-lightenbrown p-2'>
                <div className='mx-4'>
                  <PdTitle 
                    pdname={currentPd.pd_name}/>
                </div>
                <div className='d-flex flex-column flex-md-row '>
                  <div className='d-flex align-items-center col-md-5'>
                    {/* 左邊圖片 */}
                    <PdImageGallery 
                      images={currentPd.images}/>
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
                        deliveryMethod={currentPd.delivery_method}
                        brand={currentPd.attribute.brand}
                        city={currentPd.city}
                        district={currentPd.district}
                        newLevel={currentPd.new_level}
                        />
                    </div>
                  {/* 數量調整 */}
                    <div className='d-flex align-items-center flex-md-row flex-wrap'>
                      <PdQuantity 
                      quantity={this.state.count}
                      onQuantityChange={(newQty) => this.setState({ count: newQty })}/>
                    {/* 加入購物車、收藏、分享 */}
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
                  changePage={(click) => { this.setState({ currentPage: click }) }} 
                  condition={currentPd.condition}/>

                {this.state.currentPage === "description" ? 
                  <PdInfo 
                  condition={currentPd.condition}
                  description={currentPd.description}
                  images={currentPd.images}
                  pdAttr={currentPd.attribute}/> : (currentPd.condition === "new" ? <NReview review={this.state.review.filter(r => r.pid === currentPd.pid)}/>:<SellerInfo review={this.state.review.filter(r => r.pid === currentPd.pid)}/>)}
              </div>
            </div>

            {/* 右 */}
            {currentPd.condition === "new" ? <><div className='border border-secondary col-md-2 d-none d-md-block'>c</div></>:""}
            
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