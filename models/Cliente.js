<<<<<<< HEAD
=======
// Nome,cpf, rua, numero, bairro, cpf, e-mail

>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
const { DataTypes } = require("sequelize")

const db = require("../db/conn")

const Cliente = db.define("Cliente",{
    tipo:{
        type: DataTypes.STRING(1),
        allowNull:false,
    },
    nome:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    cpfCnpj:{
        type: DataTypes.STRING(15),
        allowNull:false,
    },
    rua:{
        type: DataTypes.STRING,
        allowNull:true,
    },
    numeroCasa:{
        type: DataTypes.STRING(6),
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
        allowNull:false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull:true,
    },
});

module.exports = Cliente;
