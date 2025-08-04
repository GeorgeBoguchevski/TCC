import React, { useState } from "react";
import './cadastro.css';
import Main from '../template/Main';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    

    const Cadastrar = async (e) => {
        e.preventDefault();


        if (password.length < 4) {
          alert("Senha deve ter pelo menos 4 caracteres.");
          return;
        }

        try {
            const resposta = await axios.post('http://localhost:3001/cadastro', {
            nome: name,
            email: email,
            senha: password
        });

            alert(resposta.data.message || 'Usuário cadastrado com sucesso!');
            
            setName('');
            setEmail('');
            setPassword('');
            
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Erro. Tente novamente');
        }
    };

    return (
        <Main>
            <div className='container5'>
                <div className="titulo">
                    <div className="titulo1">
                        <h3 className="fa fa-user-circle">Cadastro</h3>
                    </div>
                    <form onSubmit={Cadastrar}>
                        <input
                            className="button"
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                        <input
                            className="button"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className="button"
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                        <button className="button" type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </Main>
    );
};
