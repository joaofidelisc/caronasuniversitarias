# caronasuniversitarias

Aplicativo sendo desenvolvido em React Native com JavaScript para servir como ferramenta de pesquisa.

Como executar o aplicativo em meu celular?

Para a primeira execução do App:

1º) Clone este repositório;

2º) Entre na pasta gerada e execute o comando 'yarn install ou npm install';

3º) Abra um terminal e execute o comando 'npm start';

4º) Em seu celular Android faça:

  - Ative o modo depuração USB nas opções de desenvolvedor;
  
  - Conecte o cabo USB e dê as permissões necessárias.
  
5º) Abra outro terminal e execute o comando 'npx react-native run-android';

  - OBS.: Garanta que o outro terminal esteja rodando o comando 'npm start';
  
6º) Aguarde enquanto o App é instalado e executado em seu celular.

Para a segunda ou demais execução do App:

Caso você precise recarregar o App ou executar novamente em um momento posterior, não precisa seguir todos os passos anteriores. Siga os passos abaixo:

1º) Abra um terminal e execute o comando 'npm start';

2º) Procure o ícone do App em seu celular e clique nele, que o mesmo será executado!

## Criação database
1º) O propósito desta arquitetura, é substituir parcialmente o Firestore do Firebase e portanto, para isso, foi escolhido o MySQL como banco de dados relacional. Dessa forma, instale o MySQL em sua máquina previamente;

2º) Após instalado o MySQL, crie o banco de dados com as credenciais abaixo:
  - HOST:"localhost",
  - USER:"root",
  - PASSWORD:"root",
  - DB:"caronasuniversitarias"

## Instruções para a execução do back-end

1º) Instale o nodemon por linha de comando:
* npm install nodemon

2º) Após instalado o nodemon, acesse o diretório "caronasuniversitarias\src\services\node-server";

3º) Execute o comando "nodemon server.js".

## Importante

O aplicativo ainda está na fase de desenvolvimento e testes, por isso, ainda há algumas funcionalidades e telas a serem implementadas.

