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
          uid: "1",
          new_level: "3",
          stock: "1",
          sale_count: "0",
          delivery_method: ["面交", "宅配", "超商取貨"],
          attribute: {
            brand: "無品牌",
            name: "灰色毛氈立方貓窩（可折疊）",
            model: "XA-123",
            purchase_date: "2024/03",
            condition_level: "3",
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
        },
        {
          "pid": "sc02",
          "condition": "second",
          "status": 1,
          "pet_type": "狗",
          "pd_name": "可拆洗狗狗睡墊（中型犬適用）",
          "price": "250",
          "description": "中型犬用可拆洗睡墊，外層為柔軟布料，內部填充棉花，提供舒適支撐力。原為家中柯基所使用，但因更換新床故出清。睡墊可拆洗設計方便清潔，適合室內使用。整體狀況良好，僅表面略有使用痕跡。",
          "categories": "狗用品",
          "city": "台中市",
          "district": "南屯區",
          "uid": "1",
          "new_level": "3星",
          "stock": "1",
          "sale_count": "0",
          "delivery_method": ["面交", "宅配"],
          "attribute": {
            "brand": "PawsCare",
            "name": "可拆洗狗狗睡墊",
            "model": "DC-B02",
            "purchase_date": "2023/11",
            "condition_level": "良好",
            "size": "約長80cm × 寬60cm × 厚6cm",
            "color": "深灰",
            "weight": "約1.2kg"
          },
          "images": [
            { "img_path": "/media/second_pd/cat/cat2_home1_1.jpeg", "img_value": "整體正面照，展示睡墊外觀" },
            { "img_path": "/media/second_pd/dog/dog2_bed1_2.jpeg", "img_value": "睡墊布套拆卸展示" },
            { "img_path": "/media/second_pd/dog/dog2_bed1_3.jpeg", "img_value": "內部填充棉狀況良好" }
          ]
        },
        {
          "pid": "sc03",
          "condition": "second",
          "status": 1,
          "pet_type": "貓",
          "pd_name": "透明貓太空包（背負式外出包）",
          "price": "380",
          "description": "背負式透明貓太空包，設有多處透氣孔與可視窗設計，能讓毛孩安心出門。原為偶爾帶貓出門所用，約使用4-5次，外觀小有刮痕但功能正常。適合體型中小的貓咪使用。",
          "categories": "外出用品",
          "city": "台中市",
          "district": "南屯區",
          "uid": "5",
          "new_level": "4星",
          "stock": "1",
          "sale_count": "1",
          "delivery_method": ["宅配", "超商取貨"],
          "attribute": {
            "brand": "PETGO",
            "name": "貓咪太空背包",
            "model": "SP-07",
            "purchase_date": "2024/01",
            "condition_level": "輕微使用痕跡",
            "size": "約高40cm × 寬32cm × 深25cm",
            "color": "透明 + 灰",
            "weight": "約900g"
          },
          "images": [
            { "img_path": "/media/second_pd/cat/cat2_home1_1.jpeg", "img_value": "背包正面展示，有透明罩" },
            { "img_path": "/media/second_pd/cat/cat2_travel1_2.jpeg", "img_value": "側邊透氣孔設計展示" },
            { "img_path": "/media/second_pd/cat/cat2_travel1_3.jpeg", "img_value": "實際背負示意圖（未包含貓）" }
          ]
        },
        {
          "pid": "sc04",
          "condition": "second",
          "status": 1,
          "pet_type": "小動物",
          "pd_name": "小型動物活動滾輪（靜音款）",
          "price": "120",
          "description": "適合倉鼠、刺蝟等小型動物使用的活動滾輪，靜音軸承設計，不打擾夜間生活。原本為飼養刺蝟所購入，僅使用兩個月後因毛孩送養而閒置。無明顯磨損，功能正常，底部有止滑墊設計。",
          "categories": "小動物用品",
          "city": "台中市",
          "district": "南屯區",
          "uid": "1",
          "new_level": "4星",
          "stock": "1",
          "sale_count": "0",
          "delivery_method": ["面交", "超商取貨"],
          "attribute": {
            "brand": "QuietRun",
            "name": "靜音滾輪",
            "model": "QR-H18",
            "purchase_date": "2024/02",
            "condition_level": "近新",
            "size": "直徑約18cm，高度約22cm",
            "color": "透明 + 粉色",
            "weight": "約300g"
          },
          "images": [
            { "img_path": "/media/second_pd/cat/cat2_home1_1.jpeg", "img_value": "整體外觀展示" },
            { "img_path": "/media/second_pd/small/small2_wheel1_2.jpeg", "img_value": "實際組裝狀況" },
            { "img_path": "/media/second_pd/small/small2_wheel1_3.jpeg", "img_value": "滾輪軸心近照，展示無損耗" }
          ]
        }
      ],
      userinfo: [
        {
          "uid": "1",
          "email": "user1234@gmail.com",
          "username": "毛🐱主人",
          "photo": "media/pet_know/pet_feeding/cat/petfeedingb_1.jpeg",
          "last_time_login": "2025-04-09 03:33:20",
          "AboutMe": "熱愛毛孩生活，分享家中用不到但保存良好的寵物用品，希望能讓更多小動物享受舒適生活。 商品皆細心清潔整理，誠信交易，歡迎喜歡的朋友來訊聊聊！",
          "Device": "/F1234567"
        },
        {
          "uid": "2",
          "email": "doglover@example.com",
          "username": "泡泡汪",
          "photo": "/img/user2",
          "last_time_login": "2025-03-29 03:33:20",
          "AboutMe": "家中有多隻狗狗，經常分享閒置但仍堪用的用品，歡迎交流與詢問。",
          "Device": "/A2345678"
        },
        {
          "uid": "3",
          "email": "rabbitmom@example.com",
          "username": "奇奇兔",
          "photo": "/img/user3",
          "last_time_login": "2025-03-19 03:33:20",
          "AboutMe": "家中有多隻兔兔，經常分享閒置但仍堪用的用品，歡迎交流與詢問。",
          "Device": "/B3456789"
        },
        {
          "uid": "4",
          "email": "hamsterguy@example.com",
          "username": "咪咪寶",
          "photo": "/img/user4",
          "last_time_login": "2025-03-21 03:33:20",
          "AboutMe": "家中有多隻鼠鼠，經常分享閒置但仍堪用的用品，歡迎交流與詢問。",
          "Device": "/C4567890"
        },
        {
          "uid": "5",
          "email": "birdfan@example.com",
          "username": "胖虎喵",
          "photo": "/img/user5",
          "last_time_login": "2025-03-21 03:33:20",
          "AboutMe": "家中有多隻鳥鳥，經常分享閒置但仍堪用的用品，歡迎交流與詢問。",
          "Device": "/D5678901"
        },
        {
          "uid": "6",
          "email": "petowner@example.com",
          "username": "多毛家庭",
          "photo": "/img/user6",
          "last_time_login": "2025-03-10 03:33:20",
          "AboutMe": "家中有多隻多毛，經常分享閒置但仍堪用的用品，歡迎交流與詢問。",
          "Device": "/E6789012"
        }
      ],
      review: [
        {
          "pid": "sc01",
          "product_name": "貓咪雞肉點心",
          "condition": "second",
          "uid": "0",
          "username": "小橘貓",
          "rating": 5,
          "comment": "商品跟描述的一樣新，賣家回覆超快，包裝也很細心，非常推薦！",
          "create_time": "2025-04-27 10:15:23"
        },
        {
          "pid": "sc01",
          "product_name": "增高飼料架",
          "condition": "second",
          "uid": "3",
          "username": "奇奇兔",
          "rating": 4,
          "comment": "收到商品速度很快，品質也不錯，唯一小小瑕疵是有些微使用痕跡。",
          "create_time": "2025-03-14 18:47:10"
        },
        {
          "pid": "sc01",
          "product_name": "狗狗玩具球",
          "condition": "second",
          "uid": "2",
          "username": "泡泡汪",
          "rating": 5,
          "comment": "價格很合理，商品乾淨，感覺賣家很用心整理過，狗狗很喜歡！",
          "create_time": "2025-02-06 22:03:45"
        },
        {
          "pid": "sc01",
          "product_name": "小鳥玩具球",
          "condition": "second",
          "uid": "9",
          "username": "匡匡鳥",
          "rating": 3,
          "comment": "東西還好",
          "create_time": "2025-02-06 22:03:45"
        },
        {
          "pid": "np01",
          "product_name": "加厚耐抓雙面貓抓板",
          "condition": "new",
          "uid": "4",
          "username": "咪咪寶",
          "rating": 5,
          "comment": "貓抓板很厚實，貓咪超愛，還會自己躺上去磨爪，非常滿意！",
          "create_time": "2025-04-15 12:30:55"
        },
        {
          "pid": "np01",
          "product_name": "加厚耐抓雙面貓抓板",
          "condition": "new",
          "uid": "5",
          "username": "胖虎喵",
          "rating": 4,
          "comment": "質感不錯，雙面設計很實用，只是貓薄荷包有點小。",
          "create_time": "2025-04-10 09:20:18"
        },
        {
          "pid": "np02",
          "product_name": "迷你攀爬貓樹",
          "condition": "new",
          "uid": "6",
          "username": "小花熊",
          "rating": 5,
          "comment": "超可愛的攀爬架，家裡小貓很快就學會爬上爬下，品質也很好！",
          "create_time": "2025-03-22 16:05:40"
        }
      ],
      currentPdIdx: 0, // 目前要顯示第幾個商品
    };
  }

  render() {
    //目前商品
    const currentPd = this.state.products[this.state.currentPdIdx]
    //目前商品的賣家資訊
    const userProfile = this.state.userinfo.find(user => user.uid === currentPd.uid);
    //賣家的其他商品
    const sellerOtherPd = this.state.products.filter((pd,idx)=>pd.uid === currentPd.uid && idx !== this.state.currentPdIdx)
    //屬於這個商品賣家的所有評論
    const sellerReview = this.state.review.filter(review=>{
      const product = this.state.products.find(p=>p.pid === review.pid)
      return product && product.uid ===currentPd.uid
    })
    //評價總分
    const totalRating = sellerReview.reduce((sum,review)=>sum+review.rating,0)
    //平均分數
    const avgRating = sellerReview.length > 0 ? (totalRating / sellerReview.length).toFixed(2) : "還沒有評價";
    //評價數量
    const ratingCount=sellerReview.length


    //新品的評價
    const newPdReview = this.state.review.filter((review)=>review.pid === currentPd.pid )
    //新品評價總分
    const newTotalRating = newPdReview.reduce((sum,review)=>sum+review.rating,0)
    //新品平均分數
    const newAvgRating = newPdReview.length > 0 ? (newTotalRating / newPdReview.length).toFixed(2) : "還沒有評價";
    //新品評價數量
    const newRatingCount=newPdReview.length
    
    
    return (
      <>
        <div className="container-fluid">
          <div className="row">
            {/* 左 */}
            <div className='col-md-2 border border-primary d-none d-md-block'>
              {/* 導入動物+商品種類篩選 */}
              {currentPd.condition === "new" ? <NewSideBar /> : <SeSideBar /> }

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
                        deliveryMethod={currentPd.delivery_method}
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
                        max= {parseInt(currentPd.stock)}
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
                      sellerOtherPd={sellerOtherPd}/>)}
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
    const { userinfo } = this.state;
    const { setSellers } = this.context;
    if (setSellers) {
      setSellers(userinfo);
    }
  }

  addToCart = async () => {
    const { addToCart } = this.context;
    const currentPd = this.state.products[this.state.currentPdIdx];
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