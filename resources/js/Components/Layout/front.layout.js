import React, { useState, useEffect } from "react";
import axios from 'axios';
import { inject, observer } from "mobx-react";
import { useHistory } from 'react-router-dom';
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap';
import {LinkContainer} from "react-router-bootstrap";

const Layout = (props) => {
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const token = (props.AuthStore.appState != null) ? props.AuthStore.appState.user.access_token : null;
        axios.post(`/api/authenticate`,{},{
            headers:{
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if(!res.data.isLoggedIn){
                history.push('/login');
            }
            setUser(res.data.user);
            setIsLoggedIn(res.data.isLoggedIn);
        }).catch(e => {
                history.push('/login');
            });
    },[]);

    const logout = () => {
        axios.post(`/api/logout`, {}, {
            headers: {
                Authorization: 'Bearer ' + props.AuthStore.appState.user.access_token
            }
        }).then(res => console.log(res)).catch(e => console.log(e));
        props.AuthStore.removeToken();
        history.push('/login');
    };

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">Asan Satış</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <LinkContainer to={'/category'}>
                                <Nav.Link>Bölmə</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to={'/customer'}>
                                <Nav.Link>Müştəri & Tədarikçi</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to={'/product'}>
                                <Nav.Link>Mal</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to={'/stock'}>
                                <Nav.Link>Stok</Nav.Link>
                            </LinkContainer>
                        </Nav>
                        <Nav>
                            <NavDropdown title={user.name} id="collasible-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Profilini düzənlə</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Şifrəni dəyiş</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={logout}>Çıxış</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>{props.children}</div>
        </div>
    )
};
export default inject("AuthStore")(observer(Layout));
