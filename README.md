# appControleFabrica

IMPORTS:
  npm install express express-handlebars sequelize mysql2 bcryptjs connect-flash cookie-parser cookie-session express-flash nodemon express-session session-file-store

DB: 
  ANTES DE RODAR O 'npm start':
  
     DROP DATABASE IF EXISTS appcontrolefabrica;
      CREATE DATABASE appcontrolefabrica;

  DEPOIS DE RODAR O 'npm start':

      USE appcontrolefabrica;

    INSERT INTO produtos (nomeProduto, descricao, qtd, valorUnitario, createdAt, updatedAt)
        VALUES
      ('Velas de Ignição', 'Conjunto com 4 velas de ignição', 100, 9.99, NOW(), NOW()),
      ('Filtro de Óleo', 'Filtro de óleo de reposição', 200, 12.99, NOW(), NOW()),
      ('Pastilhas de Freio', 'Pastilhas de freio dianteiras', 50, 39.99, NOW(), NOW()),
      ('Filtro de Ar', 'Filtro de ar do motor', 150, 14.99, NOW(), NOW()),
      ('Bateria', 'Bateria de carro', 20, 89.99, NOW(), NOW()),
      ('Palhetas do Limpador', 'Par de palhetas do limpador de para-brisa', 80, 19.99, NOW(), NOW()),
      ('Medidor de Pressão de Pneus', 'Medidor digital de pressão de pneus', 120, 24.99, NOW(), NOW()),
      ('Óleo do Motor', 'Recipiente com 5 litros de óleo do motor', 30, 34.99, NOW(), NOW()),
      ('Filtro de Combustível', 'Filtro de combustível de reposição', 70, 19.99, NOW(), NOW()),
      ('Filtro de Ar Condicionado', 'Filtro de ar condicionado interno', 100, 29.99, NOW(), NOW());

      INSERT INTO clientes (tipo, nome, cpfCnpj, rua, numeroCasa, complemento, bairro, cidade, uf, telefone, email, createdAt, updatedAt)
    VALUES 
    ('F', 'João da Silva', '12345678901', 'Rua Principal', '1A', 'Apto 2B', 'Centro', 'Cidade', 'UF', '1234567890', 'joao.silva@example.com', NOW(), NOW()),
      ('J', 'Maria Santos', '98765432101', 'Avenida das Flores', '2B', NULL, 'Bairro Novo', 'Cidadezinha', 'UF', '9876543210', 'maria.santos@example.com', NOW(), NOW()),
      ('F', 'Ana Oliveira', '56789012345', 'Rua do Sol', '3C', 'Bloco 4D', 'Centro', 'Cidade', 'UF', '5678901234', 'ana.oliveira@example.com', NOW(), NOW()),
      ('J', 'Pedro Souza', '54321098765', 'Avenida das Árvores', '4D', NULL, 'Bairro Antigo', 'Cidadezinha', 'UF', '5432109876', 'pedro.souza@example.com', NOW(), NOW()),
      ('F', 'Carolina Costa', '65432109876', 'Rua da Praia', '5E', NULL, 'Orla', 'Cidade', 'UF', '6543210987', 'carolina.costa@example.com', NOW(), NOW()),
      ('J', 'Lucas Fernandes', '10987654321', 'Avenida dos Pinheiros', '6F', NULL, 'Bairro Novo', 'Cidadezinha', 'UF', '1098765432', 'lucas.fernandes@example.com', NOW(), NOW()),
      ('F', 'Mariana Almeida', '32109876543', 'Rua das Pedras', '7G', 'Bloco 8H', 'Centro', 'Cidade', 'UF', '3210987654', 'mariana.almeida@example.com', NOW(), NOW()),
      ('J', 'Guilherme Carvalho', '87654321098', 'Avenida do Cedro', '8H', NULL, 'Bairro Antigo', 'Cidadezinha', 'UF', '8765432109', 'guilherme.carvalho@example.com', NOW(), NOW()),
      ('F', 'Larissa Pereira', '89012345678', 'Rua do Ipê', '9I', NULL, 'Orla', 'Cidade', 'UF', '8901234567', 'larissa.pereira@example.com', NOW(), NOW()),
      ('J', 'Rafael Gonçalves', '43210987654', 'Avenida dos Coqueiros', '10J', NULL, 'Bairro Novo', 'Cidadezinha', 'UF', '4321098765', 'rafael.goncalves@example.com', NOW(), NOW());



    
    
