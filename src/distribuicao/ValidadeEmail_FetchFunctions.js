//import fetch from 'node-fetch';

export default async function validateEmail(email) {
    console.log('Chegou na validateEmail antes do fetch');

    try {
        const response = await fetch('http://localhost:3001/validateEmail?email=' + email);
        console.log('Depois do fetch');

        const { result } = await response.json();
        return result;
    } catch (error) {
        console.log('Erro que deu: ' + error);
        throw error;
    }
}
