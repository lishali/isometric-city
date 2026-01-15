// Market Volatility System - Makes the economy more dynamic and challenging
import { GameState } from '@/types/game';

export type MarketCondition = 'boom' | 'normal' | 'recession' | 'crash';

export interface MarketState {
  condition: MarketCondition;
  intensity: number; // 0.5 to 2.0 multiplier
  timeRemaining: number; // ticks until next change
  trend: 'improving' | 'stable' | 'declining';
}

export function createInitialMarketState(): MarketState {
  return {
    condition: 'normal',
    intensity: 1.0,
    timeRemaining: 100, // 100 ticks until first change
    trend: 'stable',
  };
}

export function updateMarketConditions(market: MarketState): MarketState {
  const newMarket = { ...market };
  
  newMarket.timeRemaining--;
  
  if (newMarket.timeRemaining <= 0) {
    // Time for a market change!
    const random = Math.random();
    
    // Market transitions based on current condition
    switch (market.condition) {
      case 'boom':
        if (random < 0.3) {
          newMarket.condition = 'normal';
          newMarket.intensity = 1.0;
          newMarket.trend = 'declining';
        } else if (random < 0.1) {
          newMarket.condition = 'recession';
          newMarket.intensity = 0.7;
          newMarket.trend = 'declining';
        }
        break;
        
      case 'normal':
        if (random < 0.2) {
          newMarket.condition = 'boom';
          newMarket.intensity = 1.5;
          newMarket.trend = 'improving';
        } else if (random < 0.4) {
          newMarket.condition = 'recession';
          newMarket.intensity = 0.8;
          newMarket.trend = 'declining';
        }
        break;
        
      case 'recession':
        if (random < 0.4) {
          newMarket.condition = 'normal';
          newMarket.intensity = 1.0;
          newMarket.trend = 'improving';
        } else if (random < 0.1) {
          newMarket.condition = 'crash';
          newMarket.intensity = 0.5;
          newMarket.trend = 'declining';
        }
        break;
        
      case 'crash':
        if (random < 0.6) {
          newMarket.condition = 'recession';
          newMarket.intensity = 0.7;
          newMarket.trend = 'improving';
        } else if (random < 0.2) {
          newMarket.condition = 'normal';
          newMarket.intensity = 1.0;
          newMarket.trend = 'improving';
        }
        break;
    }
    
    // Set time for next change (random between 50-200 ticks)
    newMarket.timeRemaining = 50 + Math.floor(Math.random() * 150);
  }
  
  return newMarket;
}

export function getMarketMultipliers(market: MarketState) {
  return {
    buildingCosts: market.condition === 'boom' ? 1.3 : 
                   market.condition === 'recession' ? 0.8 : 
                   market.condition === 'crash' ? 0.6 : 1.0,
    
    taxIncome: market.intensity,
    
    jobGrowth: market.condition === 'boom' ? 1.4 : 
               market.condition === 'recession' ? 0.7 : 
               market.condition === 'crash' ? 0.4 : 1.0,
  };
}

export function getMarketDescription(market: MarketState): string {
  switch (market.condition) {
    case 'boom': return '📈 Economic Boom! High costs but great income!';
    case 'recession': return '📉 Recession - Lower costs but reduced income';
    case 'crash': return '💥 Market Crash! Cheap buildings but terrible income!';
    default: return '📊 Normal market conditions';
  }
}