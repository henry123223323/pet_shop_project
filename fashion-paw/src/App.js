import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import MemberCenter from './component/MemberCenter/MyAccount'
import Homepage from './component/Homepage/Homepage';
import ProductPage from './component/ProductPage/ProductPage';

function App() {
  return (
    <BrowserRouter>
    <h1 className='bg-danger'>Header</h1>
      <Switch>
        <Route path="/" component={ Homepage } exact/>
        <Route path="/MemberCenter" component={ MemberCenter } exact/>
        <Route path="/ProductPage" component={ ProductPage } exact/>
      </Switch>
      <h1 className='bg-primary'>Footer</h1>
    </BrowserRouter>
  );
}

export default App;
