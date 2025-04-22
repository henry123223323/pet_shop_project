import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MemberCenter from './component/MemberCenter/MyAccount'
import Homepage from './component/Homepage/Homepage';
import Login from './component/MemberCenter/Login';
import Register from './component/MemberCenter/Register';

function App() {
  return (
    <BrowserRouter>
    <h1 className='bg-danger'>Header</h1>
      <Switch>
        <Route path="/" component={ Homepage } exact/>
        <Route path="/MemberCenter" component={ MemberCenter } exact/>
        <Route path="/MemberCenter/Login" component={ Login } exact/>
        <Route path="/MemberCenter/Register" component={ Register } exact/>
      </Switch>
      <h1 className='bg-primary'>Footer</h1>
    </BrowserRouter>
  );
}

export default App;
