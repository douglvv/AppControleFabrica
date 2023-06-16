<<<<<<< HEAD
=======
// Nome,cpf, rua, numero, bairro, cpf, e-mail

>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
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
