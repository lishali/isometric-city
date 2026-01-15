// Achievement System - Rewards players for reaching milestones
import { GameState, BuildingType } from '@/types/game';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: {
    money?: number;
    happinessBonus?: number;
    unlocksBuilding?: BuildingType;
    title?: string;
  };
  condition: (gameState: GameState) => boolean;
  unlocked: boolean;
  progress?: (gameState: GameState) => { current: number; target: number };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_city',
    name: 'City Founder',
    description: 'Build your first city with 100 population',
    icon: '🏙️',
    reward: { money: 5000, title: 'City Founder' },
    condition: (state) => state.stats.population >= 100,
    unlocked: false,
    progress: (state) => ({ current: state.stats.population, target: 100 }),
  },
  
  {
    id: 'metropolis',
    name: 'Metropolis',
    description: 'Reach 10,000 population',
    icon: '🌆',
    reward: { money: 50000, happinessBonus: 10, title: 'Metropolitan Mayor' },
    condition: (state) => state.stats.population >= 10000,
    unlocked: false,
    progress: (state) => ({ current: state.stats.population, target: 10000 }),
  },
  
  {
    id: 'green_city',
    name: 'Green City',
    description: 'Build 50 parks and maintain 80+ environment rating',
    icon: '🌳',
    reward: { money: 20000, unlocksBuilding: 'greenhouse_garden' },
    condition: (state) => {
      const parkCount = countBuildingType(state, ['park', 'park_large']);
      return parkCount >= 50 && state.stats.environment >= 80;
    },
    unlocked: false,
    progress: (state) => ({ 
      current: countBuildingType(state, ['park', 'park_large']), 
      target: 50 
    }),
  },
  
  {
    id: 'economic_powerhouse',
    name: 'Economic Powerhouse',
    description: 'Generate $100,000 per month in tax revenue',
    icon: '💰',
    reward: { money: 100000, title: 'Economic Genius' },
    condition: (state) => state.stats.income >= 100000,
    unlocked: false,
    progress: (state) => ({ current: state.stats.income, target: 100000 }),
  },
  
  {
    id: 'sports_capital',
    name: 'Sports Capital',
    description: 'Build every type of sports facility',
    icon: '🏆',
    reward: { money: 30000, happinessBonus: 20 },
    condition: (state) => {
      const sportsBuildings: BuildingType[] = [
        'stadium', 'baseball_stadium', 'basketball_courts', 'tennis',
        'soccer_field_small', 'baseball_field_small', 'football_field',
        'swimming_pool', 'skate_park'
      ];
      return sportsBuildings.every(building => 
        countBuildingType(state, [building]) > 0
      );
    },
    unlocked: false,
  },
  
  {
    id: 'education_hub',
    name: 'Education Hub',
    description: 'Build 10 schools and 3 universities',
    icon: '🎓',
    reward: { money: 25000, unlocksBuilding: 'community_center' },
    condition: (state) => {
      const schools = countBuildingType(state, ['school']);
      const universities = countBuildingType(state, ['university']);
      return schools >= 10 && universities >= 3;
    },
    unlocked: false,
    progress: (state) => ({ 
      current: countBuildingType(state, ['school']), 
      target: 10 
    }),
  },
  
  {
    id: 'disaster_survivor',
    name: 'Disaster Survivor',
    description: 'Survive 10 fires without losing any buildings',
    icon: '🚒',
    reward: { money: 15000, happinessBonus: 15 },
    condition: (state) => {
      // You'd need to track this in game state
      return false; // Placeholder
    },
    unlocked: false,
  },
  
  {
    id: 'transport_master',
    name: 'Transport Master',
    description: 'Build roads, rails, subway, and airport',
    icon: '🚇',
    reward: { money: 40000, title: 'Transport Tycoon' },
    condition: (state) => {
      const hasRoad = countBuildingType(state, ['road']) > 10;
      const hasRail = countBuildingType(state, ['rail']) > 5;
      const hasSubway = countBuildingType(state, ['subway_station']) > 0;
      const hasAirport = countBuildingType(state, ['airport']) > 0;
      return hasRoad && hasRail && hasSubway && hasAirport;
    },
    unlocked: false,
  },
  
  {
    id: 'happy_citizens',
    name: 'Happy Citizens',
    description: 'Maintain 90+ happiness for 100 ticks',
    icon: '😊',
    reward: { money: 20000, happinessBonus: 5 },
    condition: (state) => {
      // You'd need to track happiness over time
      return state.stats.happiness >= 90;
    },
    unlocked: false,
  },
  
  {
    id: 'millionaire_mayor',
    name: 'Millionaire Mayor',
    description: 'Accumulate $1,000,000 in city funds',
    icon: '💎',
    reward: { title: 'Millionaire Mayor', happinessBonus: 25 },
    condition: (state) => state.stats.money >= 1000000,
    unlocked: false,
    progress: (state) => ({ current: state.stats.money, target: 1000000 }),
  },
];

function countBuildingType(state: GameState, buildingTypes: BuildingType[]): number {
  let count = 0;
  for (const row of state.grid) {
    for (const tile of row) {
      if (buildingTypes.includes(tile.building.type)) {
        count++;
      }
    }
  }
  return count;
}

export function checkAchievements(gameState: GameState): Achievement[] {
  const newlyUnlocked: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!achievement.unlocked && achievement.condition(gameState)) {
      achievement.unlocked = true;
      newlyUnlocked.push(achievement);
    }
  }
  
  return newlyUnlocked;
}

export interface AchievementWithProgress extends Omit<Achievement, 'progress'> {
  progress?: { current: number; target: number };
}

export function getAchievementProgress(gameState: GameState): AchievementWithProgress[] {
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    progress: achievement.progress ? achievement.progress(gameState) : undefined,
  }));
}