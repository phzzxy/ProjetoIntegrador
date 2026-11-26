import express from 'express';
import conexo from './BN.js';

const app = express();
const porta = 8080;

app.use(express.json());
app.use(express.static('public')); 

app.listen(porta, () => {
    console.log(`Servidor ativo na porta ${porta}`);
});


app.get('/produtos', async (req, res) => {
    try {
        const [produtos] = await conexo.query(
            'SELECT * FROM produtos ORDER BY id DESC'
        );

        res.json(produtos);
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao buscar produtos'
        });
    }
});


app.post('/produtos', async (req, res) => {
    try {
        const { nome, descricao, preco, categoria } = req.body;

        if (!nome || !descricao || !categoria || preco === undefined || Number(preco) < 0 || !Number.isFinite(Number(preco))) {
            return res.status(400).json({
                mensagem: 'Preencha os dados corretamente!'
            });
        }

        const sql = `
            INSERT INTO produtos
            (nome, descricao, preco, categoria)
            VALUES (?, ?, ?, ?)
        `;

        const [resultado] = await conexo.execute(sql, [
            nome,
            descricao,
            Number(preco),
            categoria
        ]);

        res.status(201).json({
            mensagem: 'Produto cadastrado com sucesso!',
            id: resultado.insertId
        });
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao cadastrar produto'
        });
    }
});


app.delete('/produtos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[1-9]\d*$/.test(id)) {
            return res.status(400).json({
                mensagem: 'ID inválido!'
            });
        }

        const [resultado] = await conexo.execute(
            'DELETE FROM produtos WHERE id = ?',
            [id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: 'Produto não encontrado!'
            });
        }

        res.json({
            mensagem: 'Produto excluído com sucesso!'
        });
    } catch (erro) {
        res.status(500).json({
            mensagem: 'Erro ao excluir produto'
        });
    }
});
