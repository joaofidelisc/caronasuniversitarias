const SSE = require('express-sse');

const sse = new SSE();

sse.init();
sse.on('connected', function(){
    console.log('Conexão SSE estabelecida!');
})

module.exports = sse;