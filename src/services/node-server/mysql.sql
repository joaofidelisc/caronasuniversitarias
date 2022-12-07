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
	Veiculo_ID VARCHAR (150) NOT NULL, 
    User_ID INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
	nome_veiculo VARCHAR (150) NOT NULL,
    ano_veiculo INT,
    cor_veiculo VARCHAR (15) NOT NULL,
    placa_veiculo VARCHAR (7) NOT NULL,
);

CREATE TABLE Viagens(
	User_ID INT NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
    refViagem VARCHAR (150) NOT NULL,
    uidMotorista VARCHAR (150) NOT NULL,
	dataViagem DATE,
    destino VARCHAR (150) NOT NULL,
    fotoPerfil IMAGE,
    nome VARCHAR (150) NOT NULL,
);