import './Nav.css';
import React from 'react';
import { Link } from 'react-router-dom';
const Nav = () => (
    <aside className="menu-area">
        <nav className="menu">
            <Link to="/home" >
                <i className="fa fa-home"> Início </i> 
            </Link>
            <Link to="/historico" >
                <i className="fa fa-clock-o"> Histórico </i> 
            </Link>
            <Link to="/" >
                <i className="fa fa-user"> Login </i> 
            </Link>
            <Link to="/cadastro" >
                <i className="fa fa-user"> Cadastro </i> 
            </Link>
        </nav>
    </aside>
)
export default Nav;