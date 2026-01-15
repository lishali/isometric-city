import { GameState, Tile, BuildingType, BUILDING_COSTS } from '../types/game';

export function createInitialGameState(gridSize: number = 20): GameState {
  const grid: Tile[][] = [];
  
  for (let y = 0; y < gridSize; y++) {
    grid[y] = [];
    for (let x = 0; x < gridSize; x++) {
      grid[y][x] = {
        building: 'empty',
        x,
        y,
      };
    }
  }
  
  return {
    grid,
    selectedTool: 'house',
    population: 0,
    money: 10000,
    gridSize,
  };
}

export function placeBuilding(
  gameState: GameState,
  x: number,
  y: number,
  buildingType: BuildingType
): GameState {
  const cost = BUILDING_COSTS[buildingType];
  
  // Check if we can afford it (except for bulldoze)
  if (buildingType !== 'empty' && gameState.money < cost) {
    return gameState;
  }
  
  // Check bounds
  if (x < 0 || x >= gameState.gridSize || y < 0 || y >= gameState.gridSize) {
    return gameState;
  }
  
  // Create new grid with the building placed
  const newGrid = gameState.grid.map(row => [...row]);
  const oldBuilding = newGrid[y][x].building;
  newGrid[y][x] = { ...newGrid[y][x], building: buildingType };
  
  // Calculate money change
  let moneyChange = 0;
  if (buildingType === 'empty') {
    // Bulldozing - refund half the cost of the old building
    moneyChange = Math.floor(BUILDING_COSTS[oldBuilding] / 2);
  } else {
    // Building - pay the cost
    moneyChange = -cost;
  }
  
  // Calculate new population
  const newPopulation = calculatePopulation(newGrid);
  
  return {
    ...gameState,
    grid: newGrid,
    money: gameState.money + moneyChange,
    population: newPopulation,
  };
}

function calculatePopulation(grid: Tile[][]): number {
  let population = 0;
  
  for (const row of grid) {
    for (const tile of row) {
      if (tile.building === 'house') {
        population += 4; // Each house has 4 people
      }
    }
  }
  
  return population;
}

export function simulateTick(gameState: GameState): GameState {
  // Simple simulation - houses generate money if there are shops nearby
  let income = 0;
  
  for (let y = 0; y < gameState.grid.length; y++) {
    for (let x = 0; x < gameState.grid[y].length; x++) {
      const tile = gameState.grid[y][x];
      
      if (tile.building === 'house') {
        // Check for nearby shops (within 2 tiles)
        let hasNearbyShop = false;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const checkY = y + dy;
            const checkX = x + dx;
            if (
              checkY >= 0 && checkY < gameState.grid.length &&
              checkX >= 0 && checkX < gameState.grid[checkY].length &&
              gameState.grid[checkY][checkX].building === 'shop'
            ) {
              hasNearbyShop = true;
              break;
            }
          }
          if (hasNearbyShop) break;
        }
        
        if (hasNearbyShop) {
          income += 10; // Houses with nearby shops generate $10 per tick
        } else {
          income += 2; // Houses without shops generate $2 per tick
        }
      }
    }
  }
  
  return {
    ...gameState,
    money: gameState.money + income,
  };
}