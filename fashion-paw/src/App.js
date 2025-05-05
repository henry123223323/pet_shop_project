import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

import styles from './component/Homepage/IndexStyle.module.css'
import MemberCenter from './component/MemberCenter/MyAccount'
import Homepage from './component/Homepage/Homepage';
import SecondPdDetailPage from './component/ProductDetailPage/SecondPdDetailPage';
import ShoppingCartPage from './component/Cart/ShoppingCartPage';
import CheckBillPage from './component/CheckBill/CheckBillPage';
import ProductPage from './component/ProductPage/ProductPage';
import Login from './component/MemberCenter/Login';
import Register from './component/MemberCenter/Register';

import Touch from './component/PetKnowledge/PartTouch/Touch';
import Quiz from './component/PetKnowledge/PetQuiz/Quiz';
import KnowledgeLayout from './component/PetKnowledge/KnowledgeLayout';
import ArticleDetail from './component/PetKnowledge/ArticleDetail';
import Header from './component/Homepage/Header';
import Footer from './component/Homepage/Footer';

import SeProductPage from './component/SeproductPage/SeProductPage';
import Helpme from './component/Aboutus/helpme';


function App() {
  return (
    <BrowserRouter>
        <Header />
      <main className={styles.mainContent}>
        <Switch>
          <Route path="/" component={Homepage} exact />
          <Route path="/MemberCenter" component={MemberCenter} />
          <Route path="/ProductPage" component={ProductPage} exact />
          <Route path="/SeProductPage" component={ SeProductPage } exact/>
          <Route path="/Login" component={Login} />
          <Route path="/Register" component={Register} />
          <Route
            path="/Novicefeeding/:pet/:id"
            exact
            render={props => (
              <ArticleDetail 
                {...props}
                topic="Novicefeeding"
              />
            )}
          />
          <Route
            path="/HealthCheck/:pet/:id"
            exact
            render={props => (
              <ArticleDetail 
                {...props}
                topic="HealthCheck"
              />
            )}
          />
          <Route
            path="/Novicefeeding/:pet"
            exact
            render={props => (
              <KnowledgeLayout  
                {...props}
                topic="Novicefeeding"
              />
            )}
          />
          <Route
            path="/HealthCheck/:pet"
            exact
            render={props => (
              <KnowledgeLayout  
                {...props}
                topic="HealthCheck"
              />
            )}
          />
          <Route path="/PetKnowledge" component={KnowledgeLayout} exact />
          <Route path="/PartTouch/Touch" component={Touch} exact />
          <Route path="/PetQuiz/Quiz" component={Quiz} exact />
          <Route path="/SecondPdDetailPage" component={SecondPdDetailPage} exact />
          <Route path="/ShoppingCartPage" component={ShoppingCartPage} exact />
          <Route path="/CheckBillPage" component={CheckBillPage} exact />
          <Route path="/Aboutus" component={Helpme} exact />
        </Switch>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;