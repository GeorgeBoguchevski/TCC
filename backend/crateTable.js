import { sql } from './sql.js';

// Cria extensão para UUID (se não existir)
await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`;

// Tabela cadastro (usuários)
await sql`
CREATE TABLE IF NOT EXISTS cadastro (
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);
`;

// Tabela login (separada, mas cuidado para não duplicar usuários)
await sql`
CREATE TABLE IF NOT EXISTS login 
  id SERIAL PRIMARY KEY,
  usuario TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL
);
`;

// Tabela relatorio (relatórios separados da tabela historico)
await sql`
CREATE TABLE IF NOT EXISTS relatorio (
  id SERIAL PRIMARY KEY,
  poluente TEXT NOT NULL,
  ppm NUMERIC NOT NULL,
  mgm3 NUMERIC NOT NULL,
  qualidade TEXT NOT NULL,
  particulas TEXT NOT NULL,
  caminho_pdf TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

// Tabela historico (relatórios históricos)
await sql`
CREATE TABLE IF NOT EXISTS historico (
  id SERIAL PRIMARY KEY,
  poluente TEXT NOT NULL,
  ppm FLOAT,
  mgm3 FLOAT,
  qualidade TEXT NOT NULL,
  particulas TEXT NOT NULL,
  caminho_pdf TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;
