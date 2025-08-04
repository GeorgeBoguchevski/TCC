import React, { useState } from "react";
import Main from '../template/Main';
import './home.css';

const Relatorio = () => {

    const [poluente, setPoluente] = useState("");
    const [ppm, setPpm] = useState("");
    const [qualidade, setQualidade] = useState("");
    const [particulas, setParticulas] = useState("");
    const [relatorio, setRelatorio] = useState("");

    const handleClick = async () => {
        if (!poluente || !ppm || !qualidade || !particulas) {
            alert("Preencha todos os campos!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/relatorio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ poluente, ppm, qualidade, particulas })
            });

            const resultado = await response.json();

            if (response.ok) {
                setRelatorio(` Relatório salvo com sucesso!\n Caminho: ${resultado.caminho}`);
            } else {
                setRelatorio(` Erro: ${resultado.erro}`);
            }
        } catch (err) {
            console.error(err);
            setRelatorio(" Erro ao conectar ao servidor!");
        }
    };

    return (
        <Main>
            <div className="t">    
                <div className="texto"> 
                    <h1>Bem-vindo</h1>
                    <p>Sistema de Monitoramento de emissões de poluentes.</p>
                </div>
            </div>

            <section className="container" style={{ backgroundColor: 'transparent'}}>
                <div className="quad">
                    <div className='texto1'>
                        <h1>Sistema de monitoramento <br/>de Emissões</h1>
                        <p>Monitorando a qualidade do ar e emissões em tempo real</p>
                    </div>

                    <div className="subtitulo">
                        <div className="quad3">
                            <p>Poluente:</p>
                            <input  className="imput" type="text" value={poluente} onChange={e => setPoluente(e.target.value)} placeholder="Ex: CO, NO2, NO" />
                        </div>
                        <div className="quad3">
                            <p>PPM:</p>
                            <input  className="imput" type="number" value={ppm} onChange={e => setPpm(e.target.value)} placeholder="Ex: 2.5" />
                        </div>
                    </div>
                    <div className="subtitulo">
                        <div className="quad3">
                            <p>Qualidade do ar:</p>
                            <input  className="imput" type="text" value={qualidade} onChange={e => setQualidade(e.target.value)} placeholder="Ex: Boa, Ruim" />
                        </div>
                        <div className="quad3">
                            <p>Nível de partículas:</p>
                            <input  className="imput" type="number" value={particulas} onChange={e => setParticulas(e.target.value)} placeholder="Ex: 40" />
                        </div>
                    </div>

                    <div className="button">
                        <button  type="button" className="botao" onClick={handleClick}>Calcular</button>
                    </div>
                </div>    

                <div className="quad2">
                    <h1>Relatório:</h1>
                    <pre style={{ whiteSpace: "pre-wrap" }}>{relatorio}</pre>
                </div>
            </section>
        </Main>
    );
};

export default Relatorio;