// Random Events System - Adds unexpected challenges and bonuses
import { GameState, BuildingType } from '@/types/game';

export type EventType = 
  | 'tech_boom' | 'tourism_surge' | 'factory_strike' | 'sports_championship'
  | 'university_grant' | 'power_outage' | 'water_shortage' | 'celebrity_visit'
  | 'startup_incubator' | 'food_festival' | 'construction_boom' | 'traffic_jam';

export interface RandomEvent {
  type: EventType;
  title: string;
  description: string;
  duration: number; // ticks
  effects: {
    moneyBonus?: number;
    happinessBonus?: number;
    buildingTypeBonus?: { type: BuildingType; multiplier: number }[];
    globalMultiplier?: { income?: number; costs?: number; happiness?: number };
  };
}

const RANDOM_EVENTS: RandomEvent[] = [
  {
    type: 'tech_boom',
    title: '💻 Tech Boom!',
    description: 'A major tech company announces they\'re moving to your city! Office buildings generate double income.',
    duration: 150,
    effects: {
      moneyBonus: 5000,
      buildingTypeBonus: [
        { type: 'office_low', multiplier: 2.0 },
        { type: 'office_high', multiplier: 2.0 },
      ],
    },
  },
  {
    type: 'tourism_surge',
    title: '🏖️ Tourism Boom!',
    description: 'Your city was featured in a travel magazine! Parks and entertainment generate extra happiness.',
    duration: 100,
    effects: {
      happinessBonus: 20,
      buildingTypeBonus: [
        { type: 'park', multiplier: 1.5 },
        { type: 'park_large', multiplier: 1.5 },
        { type: 'amusement_park', multiplier: 2.0 },
        { type: 'stadium', multiplier: 1.8 },
      ],
    },
  },
  {
    type: 'factory_strike',
    title: '🏭 Factory Strike!',
    description: 'Workers are on strike! Industrial buildings produce no income but also no pollution.',
    duration: 80,
    effects: {
      buildingTypeBonus: [
        { type: 'factory_small', multiplier: 0.0 },
        { type: 'factory_medium', multiplier: 0.0 },
        { type: 'factory_large', multiplier: 0.0 },
      ],
    },
  },
  {
    type: 'sports_championship',
    title: '🏆 Championship Victory!',
    description: 'Your city\'s team won the championship! Massive happiness boost and stadium income surge!',
    duration: 120,
    effects: {
      moneyBonus: 10000,
      happinessBonus: 30,
      buildingTypeBonus: [
        { type: 'stadium', multiplier: 3.0 },
        { type: 'baseball_stadium', multiplier: 2.5 },
      ],
    },
  },
  {
    type: 'university_grant',
    title: '🎓 Research Grant!',
    description: 'Your university received a massive research grant! Education buildings boost the entire city.',
    duration: 200,
    effects: {
      moneyBonus: 15000,
      buildingTypeBonus: [
        { type: 'university', multiplier: 1.8 },
        { type: 'school', multiplier: 1.4 },
      ],
      globalMultiplier: { happiness: 1.1 },
    },
  },
  {
    type: 'celebrity_visit',
    title: '⭐ Celebrity Visit!',
    description: 'A famous celebrity is visiting your city! Temporary happiness boost and tourism income.',
    duration: 50,
    effects: {
      moneyBonus: 8000,
      happinessBonus: 25,
      globalMultiplier: { income: 1.2 },
    },
  },
  {
    type: 'construction_boom',
    title: '🏗️ Construction Boom!',
    description: 'Building materials are cheap and workers are plentiful! All construction costs reduced by 30%.',
    duration: 100,
    effects: {
      globalMultiplier: { costs: 0.7 },
    },
  },
  {
    type: 'power_outage',
    title: '⚡ Power Crisis!',
    description: 'Rolling blackouts affect the city! Happiness drops but people use less power.',
    duration: 60,
    effects: {
      happinessBonus: -15,
      globalMultiplier: { income: 0.8 },
    },
  },
];

export function shouldTriggerRandomEvent(gameState: GameState): boolean {
  // 2% chance per tick, but only if city has some development
  const hasBuildings = gameState.stats.population > 100;
  return hasBuildings && Math.random() < 0.02;
}

export function getRandomEvent(): RandomEvent {
  return RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
}

export function applyEventEffects(gameState: GameState, event: RandomEvent): GameState {
  const newState = { ...gameState };
  
  // Apply immediate money bonus
  if (event.effects.moneyBonus) {
    newState.stats = {
      ...newState.stats,
      money: newState.stats.money + event.effects.moneyBonus,
    };
  }
  
  // Apply immediate happiness bonus
  if (event.effects.happinessBonus) {
    newState.stats = {
      ...newState.stats,
      happiness: Math.max(0, Math.min(100, newState.stats.happiness + event.effects.happinessBonus)),
    };
  }
  
  // Add event to active events (you'd need to add this to GameState)
  // newState.activeEvents = [...(newState.activeEvents || []), event];
  
  return newState;
}