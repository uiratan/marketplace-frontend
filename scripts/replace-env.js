const fs = require('fs');

const envFile = 'src/environments/environment.production.ts';
const googleClientId = process.env.GOOGLE_CLIENT_ID || 'MISSING_GOOGLE_CLIENT_ID';

console.log('Variável GOOGLE_CLIENT_ID detectada:', process.env.GOOGLE_CLIENT_ID);
console.log('Escrevendo environment.production.ts com clientId:', googleClientId);

const content = `
  export const environment = {
    production: true,
    googleClientId: '${googleClientId}'
  };
`;

fs.writeFileSync(envFile, content);
console.log('Arquivo environment.production.ts atualizado com sucesso');
