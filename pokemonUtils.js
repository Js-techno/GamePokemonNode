const https = require('https');

async function getPokemonData(pokemonName) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'pokeapi.co',
      port: 443,
      path: `/api/v2/pokemon/${pokemonName.toLowerCase()}`,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (e) {
            console.error(`Error parsing JSON for ${pokemonName}: `, e);
            reject(e);
          }
        } else {
          console.error(`Error fetching data for ${pokemonName}: ${res.statusCode} - ${res.statusMessage}`);
          console.error('Request options:', options);
          console.error('Response data:', data);
          reject(`Error fetching data for ${pokemonName}: ${res.statusCode} - ${res.statusMessage}`);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`Error fetching data for ${pokemonName}: `, e);
      reject(e);
    });

    req.end();
  });
}

module.exports = { getPokemonData };