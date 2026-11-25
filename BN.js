import mysql from 'mysql2/promise'

const conexao = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: "",
    database: 'picardapio'
})

export default conexao