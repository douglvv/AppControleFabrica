const { DataTypes } = require("sequelize")

const db = require("../db/conn")

<<<<<<< HEAD
const Usuario = db.define("Usuario",{
=======
const Usuario = db.define("usuario",{
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
    nome:{
        type: DataTypes.STRING,
        allowNull:false,
    },
<<<<<<< HEAD
    senha:{
        type: DataTypes.STRING,
        allowNull: false,
    }
    
});

module.exports = Usuario;
=======
    email:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    senha:{
        type: DataTypes.STRING,
        allowNull:false,
    },
});

module.exports = Usuario;
>>>>>>> 456656d6306d846126a73eb3098229fb2ae4d763
