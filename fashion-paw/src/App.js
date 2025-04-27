import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Homepage from './component/Homepage/Homepage';
import PdDetailPage from './component/ProductDetailPage/PdDetailPage';


function App() {
  return (
    <BrowserRouter>
    <h1 className='shadow-sm top-0'>Header</h1>
      <Switch>
        {/* 完成的再隱藏註解 */}
        <Route path="/" component={ Homepage } exact/>
        <Route path="/PdDetailPage" component={ PdDetailPage } exact/>

      </Switch>
      <h1 className='paw-bg-pri-darkgreen'>Footer</h1>
    </BrowserRouter>
  );
}

export default App;
