const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('appControleFabrica',
'root','megafockeR123',{
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
})

try{
    sequelize.authenticate()
    console.log('Conectado no banco de dados!')
}catch(error){
    console.log('Não foi possível conectar no BD: ',error)
}

module.exports = sequelize