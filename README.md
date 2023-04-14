# appControleFabrica

IMPORTS:
  npm install express express-handlebars sequelize mysql2 bcryptjs connect-flash cookie-parser cookie-session express-flash nodemon express-session session-file-store

DB: 
  ANTES DE RODAR O 'npm start':
     DROP DATABASE IF EXISTS appcontrolefabrica;
      CREATE DATABASE appcontrolefabrica;

  DEPOIS DE RODAR O 'npm start'
    INSERT INTO `appcontrolefabrica`.`clientes` (`tipo`, `nome`, `cpfCnpj`, `telefone`, `createdAt`, `updatedAt`) VALUES ('J', 'Moda Foker LTDA', '12345678900', '4235329978', '2023-03-25 04:55:14', '2023-03-25 04:55:14');
    INSERT INTO `appcontrolefabrica`.`clientes` (`tipo`, `nome`, `cpfCnpj`, `telefone`, `createdAt`, `updatedAt`) VALUES ('F', 'José Pilintra', '12345678900', '1234567899', '2023-03-25 04:55:14', '2023-03-25 04:55:14');

    INSERT INTO `appcontrolefabrica`.`produtos` (`nomeProduto`, `descricao`, `qtd`, `valorUnitario`, `createdAt`, `updatedAt`) VALUES ('porta', '123', '6453', '100.00', '2023-03-25 04:55:37', '2023-03-25 04:55:37');
    INSERT INTO `appcontrolefabrica`.`produtos` (`nomeProduto`, `descricao`, `qtd`, `valorUnitario`, `createdAt`, `updatedAt`) VALUES ('macaneta', '123', '123', '25.00', '2023-03-25 04:55:37', '2023-03-25 04:55:37');
