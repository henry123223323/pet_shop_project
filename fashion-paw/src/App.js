import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Homepage from './component/Homepage/Homepage';
import SecondPdDetailPage from './component/ProductDetailPage/SecondPdDetailPage';
import ShoppingCartPage from './component/Cart/ShoppingCartPage';
import CheckBillPage from './component/CheckBill/CheckBillPage';


function App() {
  return (
    <BrowserRouter>
    <h1 className='shadow-sm top-0'>Header</h1>
      <Switch>
        <Route path="/" component={ Homepage } exact/>
        <Route path="/SecondPdDetailPage" component={ SecondPdDetailPage } exact/>
        <Route path="/ShoppingCartPage" component={ ShoppingCartPage } exact/>
        <Route path="/CheckBillPage" component={ CheckBillPage } exact/>

      </Switch>
      <h1 className='paw-bg-pri-darkgreen'>Footer</h1>
    </BrowserRouter>
  );
}

export default App;
