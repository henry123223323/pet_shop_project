import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MemberCenter from './component/MemberCenter/MyAccount'
import Homepage from './component/Homepage/Homepage';
import ProductPage from './component/ProductPage/ProductPage';
import Login from './component/MemberCenter/Login';
import Register from './component/MemberCenter/Register';
import DogGuide from './component/PetKnowledge/Novicefeeding/DogGuide';
import Touch from './component/PetKnowledge/PartTouch/Touch';

function App() {
  return (
    <BrowserRouter>
    <h1 className='paw-bg-primary top-0'>Header</h1>
      <Switch>
        <Route path="/" component={ Homepage } exact/>
        <Route path="/MemberCenter" component={ MemberCenter } exact/>
        <Route path="/ProductPage" component={ ProductPage } exact/>
        <Route path="/MemberCenter/Login" component={ Login } exact/>
        <Route path="/MemberCenter/Register" component={ Register } exact/>
        <Route path="/Novicefeeding/DogGuide" component={DogGuide} exact/>
        <Route path="/PartTouch/Touch" component={Touch} exact/>
      </Switch>
      <h1 className='paw-bg-secondary'>Footer</h1>
    </BrowserRouter>
  );
}

export default App;
