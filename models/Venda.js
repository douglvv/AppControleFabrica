const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Produto = require("../models/Produto");
const Cliente = require("./Cliente");

const Venda = db.define("Venda",{
    data:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    valorTotal:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false,
    },
});

Venda.belongsTo(Cliente)
Cliente.hasMany(Venda)

Venda.belongsToMany(Produto, { through: 'VendaProduto' });
Produto.belongsToMany(Venda, { through: 'VendaProduto' });

module.exports = Venda;
