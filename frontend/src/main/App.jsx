import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import './App.css'
import React from 'react';
import { BrowserRouter, useLocation} from 'react-router-dom';

import Logo from '../components/template/Logo';
import Nav from '../components/template/Nav';
import Routes from './Routes';
import Footer from '../components/template/Footer.jsx';

const AppContent = () => {
    const location = useLocation();

    const pathname = location.pathname.toLowerCase().replace(/\/$/, '')
    const hideNavRoutes = ['/login', '/cadastro'];
    const shouldHideNav = hideNavRoutes.some(route => pathname.startsWith(route));

    console.log("pathname:", location.pathname);
    console.log("shouldHideNav", shouldHideNav);
    return(
        <div className='app'>
            {!shouldHideNav && <Logo />}
            {!shouldHideNav && <Nav />}
            <Routes />
            {!shouldHideNav && <Footer />}
        </div>
    )
}

const App = () => {
    return(
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    )
};

export default App;

