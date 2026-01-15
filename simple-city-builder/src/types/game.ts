// Basic game types for simple city builder
export type BuildingType = 'empty' | 'house' | 'shop' | 'factory' | 'road' | 'park';

export interface Tile {
  building: BuildingType;
  x: number;
  y: number;
}

export interface GameState {
  grid: Tile[][];
  selectedTool: BuildingType;
  population: number;
  money: number;
  gridSize: number;
}

export const BUILDING_COSTS: Record<BuildingType, number> = {
  empty: 0,
  house: 100,
  shop: 200,
  factory: 500,
  road: 50,
  park: 150,
};

export const BUILDING_COLORS: Record<BuildingType, string> = {
  empty: '#90EE90',  // Light green (grass)
  house: '#8B4513',  // Brown
  shop: '#4169E1',   // Blue
  factory: '#696969', // Gray
  road: '#2F4F4F',   // Dark gray
  park: '#228B22',   // Forest green
};