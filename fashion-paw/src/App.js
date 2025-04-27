import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Homepage from './component/Homepage/Homepage';
import PdDetailPageSecond from './component/ProductDetailPage/PdDetailPageSecond';
import ShoppingCart from './component/Cart/ShoppingCart';


function App() {
  return (
    <BrowserRouter>
    <h1 className='shadow-sm top-0'>Header</h1>
      <Switch>
        <Route path="/" component={ Homepage } exact/>
        <Route path="/PdDetailPageSecond" component={ PdDetailPageSecond } exact/>
        <Route path="/ShoppingCart" component={ ShoppingCart } exact/>

      </Switch>
      <h1 className='paw-bg-pri-darkgreen'>Footer</h1>
    </BrowserRouter>
  );
}

export default App;
