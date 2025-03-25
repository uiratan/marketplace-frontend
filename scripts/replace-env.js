const fs = require('fs');

const envFile = 'src/environments/environment.production.ts';
const googleClientId = process.env.GOOGLE_CLIENT_ID || 'MISSING_GOOGLE_CLIENT_ID';

const content = `
  export const environment = {
    production: true,
    googleClientId: '${googleClientId}'
  };
`;

fs.writeFileSync(envFile, content);
console.log(`Ambiente atualizado com GOOGLE_CLIENT_ID: ${googleClientId}`);
