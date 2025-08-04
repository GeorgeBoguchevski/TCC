const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");


require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"]
}));

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("Conectado ao banco Neon!"))
  .catch(err => console.error("Erro ao conectar ao banco Neon:", err));
 
  const criarTabelaCadastro = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cadastro (
        id UUID PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(200) NOT NULL
      );
    `);
    console.log("Tabela cadastro criada (ou já existia).");
  } catch (err) {
    console.error("Erro ao criar tabela cadastro:", err);
  }
};

criarTabelaCadastro();
  const criarTabelaHistorico = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS historico (
        id SERIAL PRIMARY KEY,
        poluente TEXT NOT NULL,
        ppm FLOAT,
        mgm3 FLOAT,
        qualidade VARCHAR,
        particulas VARCHAR,
        caminho_pdf TEXT,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tabela historico criada (ou já existia).");
  } catch (err) {
    console.error("Erro ao criar tabela historico:", err);
  }
};

criarTabelaHistorico();

const pastaPDF = path.join(__dirname, "pdfs");
if (!fs.existsSync(pastaPDF)) fs.mkdirSync(pastaPDF);

function ppmParaMgm3(poluente, ppm) {
  const massaMolar = { CO: 28.01, NO2: 46.01, NO: 30.01 };
  const mm = massaMolar[poluente];
  if (!mm) throw new Error("Poluente desconhecido");
  return (ppm * mm / 24.45).toFixed(2);          
}

// Rota para cadastro de usuário (usa tabela cadastro)
app.post("/cadastro", async (req, res) => {
  console.log("Recebido no cadastro:", req.body)
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha){
    return res.status(400).json({message: "Preencha todos os campos;"})
  }
  
  if (senha.length < 4) {
    return res.status(400).json({ message: "Senha deve ter pelo menos 4 caracteres." });
  }

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.query(
      "INSERT INTO cadastro (id, nome, email, senha) VALUES ($1, $2, $3, $4) RETURNING *",
      [uuidv4(), nome, email, senhaHash]
    );
    res.status(201).send({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).send({ message: "Usuário já existe" });
    }
    res.status(400).send({ message: "Erro ao cadastrar.", detalhes: error.message });
  }
});


// Rota para login (usa tabela cadastro)
app.post("/login", async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({ msg: "Usuário e senha são obrigatórios" });
  }

  try {
    console.log("DEBUG: Tentando login para:", usuario);

    // Busca na tabela cadastro usando email ou nome
    const resultado = await pool.query(
      "SELECT * FROM cadastro WHERE email = $1 OR nome = $1",
      [usuario]
    );

    const usuarioDB = resultado.rows[0];
    if (!usuarioDB) {
      console.log("Usuário não encontrado");
      return res.status(400).json({ msg: "Usuário não encontrado" });
    }

    console.log("DEBUG: Usuário encontrado:", usuarioDB.nome || usuarioDB.email);

    const senhaCorreta = await bcrypt.compare(senha, usuarioDB.senha);
    console.log("DEBUG: Senha confere?", senhaCorreta);

    if (!senhaCorreta) {
      return res.status(400).json({ msg: "Senha incorreta" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET não definido no .env");
      return res.status(500).json({ msg: "Erro interno: JWT não configurado" });
    }

    const token = jwt.sign(
      { id: usuarioDB.id, usuario: usuarioDB.nome },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ msg: "Logado com sucesso", token });

  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).json({ msg: "Erro. Tente novamente." });
  }
});

// Rota para criar relatório + salvar histórico
app.post("/relatorio", async (req, res) => {
  try {
    const { poluente, ppm, qualidade, particulas } = req.body;

    if (!poluente || !ppm || !qualidade || !particulas) {
      return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
    }

    const mgm3 = ppmParaMgm3(poluente, parseFloat(ppm));
    const nomePDF = `relatorio_${poluente}_${Date.now()}.pdf`;
    const caminhoPDF = path.join(pastaPDF, nomePDF);

    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(caminhoPDF);
    const pdfFinished = new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    doc.pipe(writeStream);
    doc.fontSize(18).text("Relatório de Qualidade do Ar", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Poluente: ${poluente}`);
    doc.text(`PPM: ${ppm}`);
    doc.text(`mg/m³: ${mgm3}`);
    doc.text(`Qualidade do ar: ${qualidade}`);
    doc.text(`Partículas: ${particulas}`);
    doc.text(`Data: ${new Date().toLocaleString()}`);
    doc.end();

    await pdfFinished;

   
    const insertResult = await pool.query(
    `INSERT INTO historico (poluente, ppm, mgm3, qualidade, particulas, caminho_pdf)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [poluente, ppm, mgm3, qualidade, particulas, caminhoPDF]
    );

  console.log("Dado inserido no histórico:", insertResult.rows[0]);

    res.json({ mensagem: "Relatório salvo com sucesso!", caminho: caminhoPDF });

  } catch (err) {
    console.error("Erro no /relatorio:", err);
    res.status(500).json({ erro: "Erro ao salvar relatório", detalhe: err.message });
  }
});


// Rota para listar histórico
app.get("/historico", async (req, res) => {
  try {
    const resultado = await pool.query("SELECT * FROM historico ORDER BY criado_em DESC");
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar o histórico" });
  }
});

// Rota para pegar últimas emissões
app.get("/emissoes", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT poluente, ppm, mgm3, qualidade, particulas, criado_em FROM historico ORDER BY criado_em DESC LIMIT 1"
    );

    if (resultado.rows.length === 0) {
      return res.json({ msg: "Nenhum dado encontrado ainda." });
    }

    const dados = resultado.rows[0];
    res.json({
      co2: dados.ppm,
      particulas: dados.particulas,
      qualidade: dados.qualidade,
      data: dados.criado_em
    });
  } catch (err) {
    console.error("Erro ao buscar emissões:", err);
    res.status(500).json({ erro: "Erro ao buscar dados de emissões" });
  }
});

app.listen(3001, () => {
  console.log(`Servidor rodando na porta ${3001}`);
}); 
