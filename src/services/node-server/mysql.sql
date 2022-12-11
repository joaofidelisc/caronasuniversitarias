CREATE DATABASE IF NOT EXISTS caronasuniversitarias;
SHOW DATABASES;
USE caronasuniversitarias;

/*
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Veiculo;
DROP TABLE IF EXISTS Viagens;
*/

-- nomeCliente
-- nome_cliente

CREATE TABLE IF NOT EXISTS Teste(
	id INTEGER PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR (150) NOT NULL
);

CREATE TABLE IF NOT EXISTS User(
	User_ID INTEGER PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR (150) NOT NULL,
    CPF VARCHAR (14) NOT NULL,
    data_nasc DATE,
    email VARCHAR (150) NOT NULL,
    num_cel VARCHAR (15) NOT NULL,
    token VARCHAR (100) NOT NULL,
    universidade VARCHAR (100) NOT NULL,
    classificacao FLOAT,
    -- numViagensRealizadas INT NOT NULL,
    fotoPerfil VARCHAR (100) NOT NULL,
    motorista BOOLEAN
);

-- CREATE TABLE IF NOT EXISTS Veiculo(
-- 	Veiculo_ID INTEGER PRIMARY KEY AUTO_INCREMENT, 
-- 	nome_veiculo VARCHAR (150) NOT NULL,
--     ano_veiculo INT NOT NULL,
--     cor_veiculo VARCHAR (15) NOT NULL,
--     placa_veiculo VARCHAR (7) NOT NULL,
--     -- FOTOVEICULO
--     CONSTRAINT fk_User_ID FOREIGN KEY (User_ID) REFERENCES User (User_ID)
-- );


-- -- RELACIONAMENTO N P/ N
-- -- CRIAR UMA TABELA A MAIS
-- CREATE TABLE IF NOT EXISTS Viagem(
--     ref_viagem INTEGER PRIMARY KEY AUTO_INCREMENT,
-- 	dataViagem DATE,
--     destino VARCHAR (150) NOT NULL,
--     -- fotoPerfil IMAGE,
--     -- fotoPerfil VARCHAR (100) NOT NULL,
--     -- nome VARCHAR (150) NOT NULL,
--     uidMotorista VARCHAR (150) NOT NULL, --CHAVE ESTRANGEIRA;
--     CONSTRAINT fk_User_ID FOREIGN KEY (User_ID) REFERENCES User (User_ID)
-- );

SELECT * FROM Users;