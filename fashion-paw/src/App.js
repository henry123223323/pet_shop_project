import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from '../src/component/Homepage/IndexStyle.module.css'
import MemberCenter from './component/MemberCenter/MyAccount'
import Homepage from './component/Homepage/Homepage';
import ProductDetailPage from './component/ProductDetailPage/ProductDetailPage';
import ShoppingCartPage from './component/Cart/ShoppingCartPage';
import CheckBillPage from './component/CheckBill/CheckBillPage';

import ProductPage from './component/ProductPage/ProductPage';
import Login from './component/MemberCenter/Login';
import Register from './component/MemberCenter/Register';
import Touch from './component/PetKnowledge/PartTouch/Touch';
import DogGuide from './component/PetKnowledge/Novicefeeding/DogGuide';
import SeProductPage from './component/SeProductPage/SeProductPage';

import Quiz from './component/PetKnowledge/PetQuiz/Quiz';
import Header from './component/Homepage/Header';
import Footer from './component/Homepage/Footer';

import Helpme from './component/Aboutus/helpme';
import { CartProvider } from 'component/Cart/CartContext';


function App() {
  return (
    <BrowserRouter>
    <CartProvider>
        <Header />
      <main className={styles.mainContent}>
        <Switch>
          <Route path="/" component={Homepage} exact />
          <Route path="/MemberCenter" component={MemberCenter} />
          <Route path="/ProductPage" component={ProductPage} exact />
          <Route path="/SeProductPage" component={ SeProductPage } exact/>
          <Route path="/Login" component={Login} />
          <Route path="/Register" component={Register} />
          <Route path="/Novicefeeding/DogGuide" component={DogGuide} exact />
          <Route path="/PartTouch/Touch" component={Touch} exact />
          <Route path="/PetQuiz/Quiz" component={Quiz} exact />
          <Route path="/ProductDetailPage" component={ProductDetailPage} exact />
          <Route path="/ShoppingCartPage" component={ShoppingCartPage} exact />
          <Route path="/CheckBillPage" component={CheckBillPage} exact />
          <Route path="/Aboutus" component={Helpme} exact />
        </Switch>
      </main>
      <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;