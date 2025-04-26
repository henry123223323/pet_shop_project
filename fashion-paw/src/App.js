import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Homepage from './component/Homepage/Homepage';
// import PdImageGallery from './component/ProductDetailPage/top/PdImageGallery';
// import PdTitleMessage from './component/ProductDetailPage/top/PdTitleMessage';
// import AddToCartBtn from './component/ProductDetailPage/top/AddToCartBtn';
// import AddToMyFavorite from './component/ProductDetailPage/top/AddToMyFavorite';
// import ShareProducts from './component/ProductDetailPage/top/ShareProductsBtn';
import PdDetailPageTop from './component/ProductDetailPage/top/PdDetailPageTop';
// import pdAttr from './component/ProductDetailPage/bottom/pdInfo/pdAttr';
// import pdDescription from './component/ProductDetailPage/bottom/pdInfo/pdDescription';
// import nReview from './component/ProductDetailPage/bottom/pdInfo/nReview';
// import sellerOtherPd from './component/ProductDetailPage/bottom/sellerInfo/sellerOtherPd';
// import sellerProfile from './component/ProductDetailPage/bottom/sellerInfo/sellerProfile';
// import sReview from './component/ProductDetailPage/bottom/sellerInfo/sReview';

function App() {
  return (
    <BrowserRouter>
    <h1 className='shadow-sm top-0'>Header</h1>
      <Switch>
        {/* 完成的再隱藏註解 */}
        <Route path="/" component={ Homepage } exact/>
        {/* ProductDetailPage-TOP */}
        {/* <Route path="/PdImageGallery" component={ PdImageGallery } exact/>
        <Route path="/PdTitleMessage" component={ PdTitleMessage } exact/>
        <Route path="/AddToCartBtn" component={ AddToCartBtn } exact/>
        <Route path="/AddToMyFavorite" component={ AddToMyFavorite } exact/>
        <Route path="/ShareProducts" component={ ShareProducts } exact/> */}
        <Route path="/PdDetailPageTop" component={ PdDetailPageTop } exact/>

        {/* ProductDetailPage-BOTTOM */}
        {/* <Route path="/pdAttr" component={ pdAttr } exact/>
        <Route path="/pdDescription" component={ pdDescription } exact/>
        <Route path="/nReview" component={ nReview } exact/>
        <Route path="/sellerOtherPd" component={ sellerOtherPd } exact/>
        <Route path="/sellerProfile" component={ sellerProfile } exact/> 
        <Route path="/sReview" component={ sReview } exact/>*/}


      </Switch>
      <h1 className='paw-bg-pri-darkgreen'>Footer</h1>
    </BrowserRouter>
  );
}

export default App;
