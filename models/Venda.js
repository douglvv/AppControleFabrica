const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Produto = require("../models/Produto");
const Cliente = require("./Cliente");
const VendaProduto = require("../models/VendaProduto")

const Venda = db.define("Venda",{
    status:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
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

Venda.belongsToMany(Produto, { through: VendaProduto });
Produto.belongsToMany(Venda, { through: VendaProduto });

module.exports = Venda;
