# appControleFabrica

IMPORTS:
  npm install express express-handlebars sequelize mysql2 bcryptjs connect-flash cookie-parser cookie-session express-flash nodemon express-session session-file-store

DB: 
  ANTES DE RODAR O 'npm start':
     DROP DATABASE IF EXISTS appcontrolefabrica;
      CREATE DATABASE appcontrolefabrica;

  DEPOIS DE RODAR O 'npm start'
    DROP DATABASE IF EXISTS appcontrolefabrica;
CREATE DATABASE appcontrolefabrica;

    INSERT INTO `appcontrolefabrica`.`produtos` (`nomeProduto`, `descricao`, `qtd`, `valorUnitario`, `createdAt`, `updatedAt`) VALUES ('porta', '123', '6453', '100.00', '2023-03-25 04:55:37', '2023-03-25 04:55:37');
    INSERT INTO `appcontrolefabrica`.`produtos` (`nomeProduto`, `descricao`, `qtd`, `valorUnitario`, `createdAt`, `updatedAt`) VALUES ('macaneta', '123', '123', '25.00', '2023-03-25 04:55:37', '2023-03-25 04:55:37');
