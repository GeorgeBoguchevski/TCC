import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from '../components/home/Home'
import Historico from '../components/home/Historico'
import Login from '../components/home/Login'
import Cadastro from '../components/home/Cadastro';

export default function AppRoutes(){
    return (
        <Routes>
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/home" element={<Home/>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        
    )
}