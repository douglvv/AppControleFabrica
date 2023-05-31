const { Op } = require('sequelize')
const db = require("../db/conn")

module.exports = class DashboardController {

    static async mostrarDashboard(req, res) { // Retorna os dados para popular o dashboard
        const dataAtual = new Date().toLocaleDateString('pt-br')


        // ===================== QTD VENDAS DIA =================================
        var sql = "SELECT IFNULL(COUNT(*),0) AS Valor FROM vendas WHERE data = CURDATE();";

        var resultado = await db.query(sql, {
            type: db.QueryTypes.SELECT,
            raw: true
        });

        const qtdVendas = parseFloat(resultado[0].Valor).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });


        //====================== FATURAMENTO DIA ================================
        var sql = "SELECT IFNULL(SUM(valorTotal),0) AS Valor FROM vendas WHERE data = CURDATE();";

        var resultado = await db.query(sql, {
            type: db.QueryTypes.SELECT,
            raw: true
        });

        const faturamentoDia = parseFloat(resultado[0].Valor).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });


        // =================== CLIENTES CADASTRADOS ===============================
        var sql = "SELECT IFNULL(COUNT(*),0) AS Valor FROM clientes;";

        var resultado = await db.query(sql, {
            type: db.QueryTypes.SELECT,
            raw: true
        });

        const qtdClientes = parseFloat(resultado[0].Valor).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        // ================== QTD PRODUTOS ESTOQUE ================================
        var sql = "SELECT IFNULL(SUM(qtd),0) AS Valor FROM produtos;";

        var resultado = await db.query(sql, {
            type: db.QueryTypes.SELECT,
            raw: true
        });

        const qtdProdutos = parseFloat(resultado[0].Valor).toLocaleString('pt-BR', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });


        // Renderiza a página
        res.render('home', { dataAtual: dataAtual, qtdVendas: qtdVendas, faturamentoDia: faturamentoDia, qtdClientes: qtdClientes, qtdProdutos: qtdProdutos})
    }

    static async dadosChart(req, res) { // Retorna um Json com os dados para popular o gráfico
        // ================= GRAFICO FATURAMENTO SEMANAL =========================
        var sql = "SELECT DAYNAME(data) AS dia, SUM(valorTotal) AS faturamento FROM vendas WHERE WEEK(data) = WEEK(CURDATE()) GROUP BY dia ORDER BY dia;";

        var faturamentoSemanal = await db.query(sql, {
            type: db.QueryTypes.SELECT,
            raw: true
        });

        console.log(faturamentoSemanal)
        res.json(faturamentoSemanal)
    }

}
