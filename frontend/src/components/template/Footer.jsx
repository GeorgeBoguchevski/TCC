import './Footer.css';
import React from 'react';
import { FaFacebook, FaInstagram,  FaEnvelope } from 'react-icons/fa'

const Footer = () => (
    <footer>
        <span>
            <a href="https://facebook.com"  ><FaFacebook/></a>
            <a href="https://instagram.com"  ><FaInstagram/></a>
            <a href="https://email.com"  ><FaEnvelope/>
            © 2025 - Todos os Direitos Resevados George, Luís e Rhenan.</a>
        </span>
    </footer>
)

export default Footer;