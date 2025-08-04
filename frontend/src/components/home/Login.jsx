import React, { useState } from "react";
import './Login.css';
import Main from '../template/Main';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const logar = async (e) => {
        e.preventDefault();

        if (!usuario.trim() || !senha.trim()) {
            alert("Preencha usuário e senha.");
            return;
        }

        try {
    const resposta = await axios.post('http://localhost:3001/login', { usuario, senha });

    localStorage.setItem('token', resposta.data.token);
    localStorage.setItem('usuario', usuario); // aqui estamos salvando o nome ou email usado no login

    alert(resposta.data.msg || 'Logado com sucesso');
    navigate('/home');
} catch (err) {
    if (err.response && err.response.data && err.response.data.msg) {
        alert(err.response.data.msg);
    } else {
        console.error("Erro inesperado:", err);
        alert('Erro. Tente novamente!');
    }
}

    };

    return (
        <Main>
            <div className='container2'>
                <div>
                    <h3 className="fa fa-user-circle">Login</h3> 
                    <input
                        className="button"
                        type="text"
                        placeholder="Usuário"
                        value={usuario}
                        onChange={e => setUsuario(e.target.value)}
                        required
                    />
                    <input
                        className="button"
                        type="password"
                        placeholder="Senha"
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                    />
                    <button
                        className="button"
                        type="button"
                        onClick={logar}
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </Main>
    );
}
