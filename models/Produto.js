const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Produto = db.define("Produto",{
    nomeProduto:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    descricao:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    qtd:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    valorUnitario:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false,
    },

});

module.exports = Produto;
