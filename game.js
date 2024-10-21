const { getPokemonData } = require('./pokemonUtils');

class Pokemon {
  constructor(name, hp = 300, moves = []) {
    this.name = name;
    this.hp = hp;
    this.moves = moves;
  }

  attack(targetPokemon, moveIndex) {
    const move = this.moves[moveIndex];
    if (move.pp > 0) {
      if (Math.random() <= move.accuracy) {
        console.log(`${this.name} used ${move.name}!`);
        move.pp--;
        targetPokemon.hp -= move.power;
        console.log(`${targetPokemon.name} took ${move.power} damage!`);
      } else {
        console.log(`${move.name} missed!`);
      }
    } else {
      console.log(`${move.name} has no PP left!`);
    }
  }
}

async function startGame() {
    try {
      const playerPokemonName = await askPlayerForPokemon();
      const playerPokemon = await createPlayerPokemon(playerPokemonName);
      const enemyPokemon = await createEnemyPokemon();
  
      while (playerPokemon.hp > 0 && enemyPokemon.hp > 0) {
        playerTurn(playerPokemon, enemyPokemon);
        if (enemyPokemon.hp > 0) {
          enemyTurn(enemyPokemon, playerPokemon);
        }
      }
  
      if (playerPokemon.hp <= 0) {
        console.log(`You lost! ${enemyPokemon.name} defeated ${playerPokemon.name}.`);
      } else {
        console.log(`You won! ${playerPokemon.name} defeated ${enemyPokemon.name}.`);
      }
    } catch (error) {
      console.error('Error starting the game:', error);
    }
  }
  
  async function askPlayerForPokemon() {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise((resolve) => {
      readline.question('Choose your Pokémon (e.g., Pikachu, Charmander, Bulbasaur): ', (pokemonName) => {
        readline.close();
        resolve(pokemonName.toLowerCase());
      });
    });
  }

async function createPlayerPokemon(pokemonName) {
    const playerPokemonData = await getPokemonData(pokemonName);
    const playerMoves = playerPokemonData.moves.slice(0, 5).map(move => ({
      name: move.move.name,
      power: Math.floor(Math.random() * 50) + 1,
      accuracy: Math.random(),
      pp: 10
    }));
    return new Pokemon(pokemonName, 300, playerMoves);
  }

async function createEnemyPokemon() {
  const enemyPokemonName = 'charmander';
  const enemyPokemonData = await getPokemonData(enemyPokemonName);
  const enemyMoves = enemyPokemonData.moves.slice(0, 5).map(move => ({
    name: move.move.name,
    power: Math.floor(Math.random() * 50) + 1,
    accuracy: Math.random(),
    pp: 10
  }));
  return new Pokemon(enemyPokemonName, 300, enemyMoves);
}

function playerTurn(playerPokemon, enemyPokemon) {
  console.log(`${playerPokemon.name}'s turn:`);
  const moveIndex = Math.floor(Math.random() * playerPokemon.moves.length);
  playerPokemon.attack(enemyPokemon, moveIndex);
}

function enemyTurn(enemyPokemon, playerPokemon) {
  console.log(`${enemyPokemon.name}'s turn:`);
  const moveIndex = Math.floor(Math.random() * enemyPokemon.moves.length);
  enemyPokemon.attack(playerPokemon, moveIndex);
}

startGame();