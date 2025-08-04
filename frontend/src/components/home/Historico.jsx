import React, { useEffect, useState } from 'react';
import './Historico.css';
import Main from '../template/Main';

const Historico = () => {
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        const carregarHistorico = async () => {
            try {
                const response = await fetch("http://localhost:3001/historico");
                const data = await response.json();
                setHistorico(data);
            } catch (error) {
                console.error("Erro ao carregar histórico:", error);
            }
        };

        carregarHistorico();
    }, []);

    return (
        <Main>
            <div className='qua'>
                <h1 className="textoH">Histórico</h1>
                {historico.length === 0 ? (
                    <p>Nenhum dado encontrado.</p>
                ) : (
                    historico.map((item, index) => (
                        <div className="qua3" key={index}>
                            <div className="tab5">
                                <h2>Usuário</h2>
                                <p>Desconhecido</p> {/* Ou coloque o nome do usuário, se disponível */}
                            </div>
                            <div className="tab">
                                <h2>Data</h2>
                                <p>{new Date(item.criado_em).toLocaleString()}</p>
                            </div>
                            <div className="tab2">
                                <h2>Poluentes emitidos</h2>
                                <p>{item.poluente}</p>
                            </div>
                            <div className="tab3">
                                <h2>Nível de partículas</h2>
                                <p>{item.particulas}</p>
                            </div>
                            <div className="tab4">
                                <h2>Qualidade do ar</h2>
                                <p>{item.qualidade}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Main>
    );
};

export default Historico;
