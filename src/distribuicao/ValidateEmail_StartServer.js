const express = require('express')
const app = express();
const port = 3001;

app.use(express.json());
app.listen(port, () => {
  console.log('Servidor rodando na porta ' + port);
});

app.get('/validateEmail', async (req, res) => {
    console.log('Chegou na rota da funcao')
    const email = req.query.email;
    const result = validateEmail(email);
    return res.json({
        result
    });
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@(estudante\.ufscar\.br|gmail\.com)$/;
    if (!email) {
        return {
            isValid: false,
            errorMessage: 'Por favor, insira um email.'
        };

    } else if (email.length > 100) {
        return {
            isValid: false,
            errorMessage: 'O email inserido é muito longo. Por favor, insira um email mais curto.'
        };

    } else if (!emailRegex.test(email)) {
        return {
            isValid: false,
            errorMessage: 'Email inválido! Por favor, insira um email válido @estudante.ufscar.br ou @gmail.com.'
        };

    }
    return {
        isValid: true
    };
}