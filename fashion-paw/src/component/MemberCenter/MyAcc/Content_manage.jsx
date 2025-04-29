import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, Redirect } from 'react-router-dom';

import New_Products_Manage from './Content_manage/New_product_manage';
import Second_Products_manage from './Content_manage/Second_product_manage';
import User_manage from './Content_manage/User_manage';
import Article_manage from './Content_manage/Article_manage';
class Content_manage extends Component {
    state = {}
    render() {
        return (
            <>
                <Router>
                    <h1>後臺管理</h1>
                    <span className='btn btn-outline-primary'><Link to="/MemberCenter/Content-manage/New_Products">新品管理</Link></span>
                    <span className='btn btn-outline-primary'><Link to="/MemberCenter/Content-manage/Second_Products">二手商品管理</Link></span>
                    <span className='btn btn-outline-primary'><Link to="/MemberCenter/Content-manage/User">使用者管理</Link></span>
                    <span className='btn btn-outline-primary'><Link to="/MemberCenter/Content-manage/Article">文章管理</Link></span>
                    <Switch>
                        <Route path="/MemberCenter/Content-manage/New_Products" component={New_Products_Manage} />
                        <Route path="/MemberCenter/Content-manage/Second_Products" component={Second_Products_manage} />
                        <Route path="/MemberCenter/Content-manage/User" component={User_manage} />
                        <Route path="/MemberCenter/Content-manage/Article" component={Article_manage} />
                    </Switch>
                </Router >
                <Route path="/MemberCenter/Content-manage">
                    <Redirect to="/MemberCenter/Content-manage/New_Products" exact />
                </Route>
            </>
        );
    }
}

export default Content_manage;

