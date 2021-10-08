import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from "./PrivateRoute";
/* Sehifeler */
import FrontIndex from './Views/Index';
import FrontLogin from './Views/Login';
import FrontRegister from './Views/Register';
/* Mallar */
import ProductIndex from './Views/Product/index';
import ProductCreate from './Views/Product/create';
import ProductEdit from './Views/Product/edit';

const Main = () => (
    <Switch>
        <PrivateRoute exact path="/" component={FrontIndex}/>
        <Route path="/login" component={FrontLogin}/>
        <Route path="/register" component={FrontRegister}/>
        <PrivateRoute exact path="/product" component={ProductIndex}/>
        <PrivateRoute path="/product/create" component={ProductCreate}/>
        <PrivateRoute path="/product/:id/edit" component={ProductEdit}/>
    </Switch>
);
export default Main;
