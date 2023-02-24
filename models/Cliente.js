// Nome,cpf, rua, numero, bairro, cpf, e-mail

const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Cliente = db.define("Cliente",{
    nome:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    cpf:{
        type: DataTypes.STRING(15),
        allowNull:false,
    },
    rua:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    numeroCasa:{
        type: DataTypes.INTEGER(5),
        allowNull:true,
    },
    complemento:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    bairro:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    cidade:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    uf:{
        type: DataTypes.STRING(2),
        allowNull:true,
    },
    telefone:{
        type: DataTypes.STRING(12),
        allowNull:true,
    },
    email:{
        type: DataTypes.STRING,
        allowNull:true,
    },
});

module.exports = Cliente;
