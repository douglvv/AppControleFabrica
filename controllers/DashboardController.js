const { Op } = require('sequelize')
const db = require("../db/conn")

module.exports = class DashboardController {

    static async mostrarDashboard(req, res) { // Retorna os dados para popular o dashboard
        try {
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
            res.render('home', { dataAtual: dataAtual, qtdVendas: qtdVendas, faturamentoDia: faturamentoDia, qtdClientes: qtdClientes, qtdProdutos: qtdProdutos })
        } catch (error) {
            console.log(error.message);
            res.send(error.message)
        }
    }

    static async dadosChart(req, res) { // Retorna um Json com os dados para popular o gráfico
        try {
            // ================= GRAFICO FATURAMENTO SEMANAL =========================
            var sql = `SELECT CASE
        WHEN DAYNAME(data) = 'Sunday' THEN 'Domingo'
        WHEN DAYNAME(data) = 'Monday' THEN 'Segunda-feira'
        WHEN DAYNAME(data) = 'Tuesday' THEN 'Terça-feira'
        WHEN DAYNAME(data) = 'Wednesday' THEN 'Quarta-feira'
        WHEN DAYNAME(data) = 'Thursday' THEN 'Quinta-feira'
        WHEN DAYNAME(data) = 'Friday' THEN 'Sexta-feira'
        WHEN DAYNAME(data) = 'Saturday' THEN 'Sábado'
      END AS dia,
      COALESCE(SUM(valorTotal), 0) AS faturamento FROM vendas WHERE WEEK(data) = WEEK(CURDATE())
          GROUP BY dia ORDER BY dia;`

            var faturamento = [
                { dia: 'Domingo', faturamento: '0.00' },
                { dia: 'Segunda-feira', faturamento: '0.00' },
                { dia: 'Terça-feira', faturamento: '0.00' },
                { dia: 'Quarta-feira', faturamento: '0.00' },
                { dia: 'Quinta-feira', faturamento: '0.00' },
                { dia: 'Sexta-feira', faturamento: '0.00' },
                { dia: 'Sábado', faturamento: '0.00' }
            ]

            var faturamentoSemanal = await db.query(sql, {
                type: db.QueryTypes.SELECT,
                raw: true
            });

            //  Compara as duas arrays e atribui o faturamento correto em cada dia.
            // Essa comparação é necessária pois, caso o faturamento seja nulo em algum dos dias da semana,
            // a query do sql não irá retornar nada para esse dia, afetando a ordem das datas no gráfico.
            for (const item of faturamento) {
                const matchingItem = faturamentoSemanal.find(
                    (semanalItem) => semanalItem.dia === item.dia
                );
                if (matchingItem) {
                    item.faturamento = matchingItem.faturamento || '0.00';
                }
            }

            // console.log(faturamento)
            res.json(faturamento)
        } catch (error) {
            console.log(error.message);
            res.json(error.message)
        }

    }

} // Fim
