CREATE DATABASE IF NOT EXISTS caronasuniversitarias;
SHOW DATABASES;
CREATE TABLE Users(
	User_ID INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    nome VARCHAR (150) NOT NULL,
    CPF VARCHAR (14) NOT NULL,
    data_nasc DATE,
    email VARCHAR (150) NOT NULL,
    num_cel VARCHAR (15) NOT NULL,
    token VARCHAR (100) NOT NULL,
    universidade VARCHAR (100) NOT NULL,
    classificacao FLOAT,
    numViagensRealizadas INT NOT NULL,
    motorista BOOLEAN
);

CREATE TABLE Veiculo(
	Veiculo_ID,
    User_ID,
	nome_veiculo,
    ano_veiculo,
    cor_veiculo,
    placa_veiculo,
);

CREATE TABLE Viagens(
	User_ID,
    refViagem,
    uidMotorista,
	dataViagem,
    destino,
    fotoPerfil,
    nome,
);