import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from "./PrivateRoute";
/* Pages */
import FrontIndex from './Views/Index';
import FrontLogin from './Views/Login';
import FrontRegister from './Views/Register';
/* Products */
import ProductIndex from './Views/Product/index';
import ProductCreate from './Views/Product/create';
import ProductEdit from './Views/Product/edit';
/* Categories */
import CategoryIndex from './Views/Category/index';
import CategoryCreate from './Views/Category/create';
import CategoryEdit from './Views/Category/edit';
/* Customers */
import CustomerIndex from './Views/Customer/index';
import CustomerCreate from './Views/Customer/create';
import CustomerEdit from './Views/Customer/edit';
/* Stocks */
import StockIndex from './Views/Stock/index';
import StockCreate from './Views/Stock/create';
import StockEdit from './Views/Stock/edit';

const Main = () => (
    <Switch>
        /* Pages */
        <PrivateRoute exact path="/" component={FrontIndex}/>
        <Route path="/login" component={FrontLogin}/>
        <Route path="/register" component={FrontRegister}/>
        /* Products */
        <PrivateRoute exact path="/product" component={ProductIndex}/>
        <PrivateRoute path="/product/create" component={ProductCreate}/>
        <PrivateRoute path="/product/:id/edit" component={ProductEdit}/>
        /* Categories */
        <PrivateRoute exact path="/category" component={CategoryIndex}/>
        <PrivateRoute path="/category/create" component={CategoryCreate}/>
        <PrivateRoute path="/category/:id/edit" component={CategoryEdit}/>
        /* Customers */
        <PrivateRoute exact path="/customer" component={CustomerIndex}/>
        <PrivateRoute path="/customer/create" component={CustomerCreate}/>
        <PrivateRoute path="/customer/:id/edit" component={CustomerEdit}/>
        /* Stocks */
        <PrivateRoute exact path="/stock" component={StockIndex}/>
        <PrivateRoute path="/stock/create" component={StockCreate}/>
        <PrivateRoute path="/stock/:id/edit" component={StockEdit}/>
    </Switch>
);
export default Main;
