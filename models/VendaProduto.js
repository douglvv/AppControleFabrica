const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const VendaProduto = db.define("VendaProduto",{
    qtd:{
        type: DataTypes.INTEGER,
        allowNull:false,
    },
    valor:{
        type: DataTypes.DECIMAL(10,2),
        allowNull:false,
    },
});

module.exports = VendaProduto;
