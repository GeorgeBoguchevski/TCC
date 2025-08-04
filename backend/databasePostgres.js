import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { sql } from './sql.js';

export class DatabasePostgres {

    async list() {
        try {
            const result = await sql`SELECT * FROM login;`;
            return result;
        } catch (err) {
            console.error("Erro ao listar logins:", err);
            return [];
        }
    }

    async create(log) {
        const logId = randomUUID();
        const { usuario, senha } = log;

        try {
            const senhaCriptografada = await bcrypt.hash(senha, 10);

            await sql`
                INSERT INTO login (id, usuario, senha)
                VALUES (${logId}, ${usuario}, ${senhaCriptografada});
            `;
        } catch (err) {
            console.error("Erro ao criar login:", err);
            throw err;
        }
    }

    async update(id, log) {
        const { usuario, senha } = log;

        try {
            const senhaCriptografada = await bcrypt.hash(senha, 10);

            await sql`
                UPDATE login
                SET usuario = ${usuario}, senha = ${senhaCriptografada}
                WHERE id = ${id};
            `;
        } catch (err) {
            console.error("Erro ao atualizar login:", err);
            throw err;
        }
    }

    async delete(id) {
        try {
            await sql`DELETE FROM login WHERE id = ${id};`;
        } catch (err) {
            console.error("Erro ao deletar login:", err);
            throw err;
        }
    }

    async verificarLogin(usuario, senha) {
        try {
            const resultado = await sql`SELECT * FROM login WHERE usuario = ${usuario};`;
            const usuarioDB = resultado[0];

            if (!usuarioDB) return { sucesso: false, mensagem: "Usuário não encontrado" };

            const senhaCorreta = await bcrypt.compare(senha, usuarioDB.senha);
            if (!senhaCorreta) return { sucesso: false, mensagem: "Senha incorreta" };

            return { sucesso: true, usuario: usuarioDB };
        } catch (err) {
            console.error("Erro ao verificar login:", err);
            return { sucesso: false, mensagem: "Erro interno" };
        }
    }
}
