import './Logo.css';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/logo.png'
const Logo = () => (
    <aside className="logo">
        <Link to="/" className="logo">
        <img src={logo} alt="logo.png"></img>
        </Link>
    </aside>
);

export default Logo;