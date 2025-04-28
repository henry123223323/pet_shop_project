import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MemberCenter from './component/MemberCenter/MyAccount'
import Homepage from './component/Homepage/Homepage';
import ProductPage from './component/ProductPage/ProductPage';
import Login from './component/MemberCenter/Login';
import Register from './component/MemberCenter/Register';
import Touch from './component/PetKnowledge/PartTouch/Touch';
import DogGuide from './component/PetKnowledge/Novicefeeding/DogGuide';
import Quiz from './component/PetKnowledge/PetQuiz/Quiz';

function App() {
  return (
    <BrowserRouter>
    <h1 className='paw-bg-primary top-0 bg-danger'>Header</h1>
      <Switch>
        <Route path="/" component={ Homepage } exact/>
        <Route path="/MemberCenter" component={ MemberCenter } />
        <Route path="/ProductPage" component={ ProductPage } exact/>
        <Route path="/Login" component={ Login } />
        <Route path="/Register" component={ Register } />
        <Route path="/Novicefeeding/DogGuide" component={DogGuide} exact/>
        <Route path="/PartTouch/Touch" component={Touch} exact/>
        <Route path="/PetQuiz/Quiz" component={Quiz} exact/>
      </Switch>
      <h1 className='bg-secondary'>Footer</h1>
    </BrowserRouter>
  );
}

export default App;
