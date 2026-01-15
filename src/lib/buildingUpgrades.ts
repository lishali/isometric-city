// Building Upgrade System - Allows players to improve existing buildings
import { BuildingType, Building } from '@/types/game';

export interface UpgradeOption {
  name: string;
  description: string;
  cost: number;
  effects: {
    populationMultiplier?: number;
    jobsMultiplier?: number;
    happinessBonus?: number;
    pollutionReduction?: number;
    incomeMultiplier?: number;
  };
  requirements?: {
    minLevel?: number;
    adjacentBuildings?: BuildingType[];
    minPopulation?: number;
  };
}

export const BUILDING_UPGRADES: Partial<Record<BuildingType, UpgradeOption[]>> = {
  house_small: [
    {
      name: 'Solar Panels',
      description: 'Add rooftop solar panels for eco-friendly energy',
      cost: 500,
      effects: {
        happinessBonus: 5,
        pollutionReduction: 2,
      },
    },
    {
      name: 'Garden Extension',
      description: 'Beautiful gardens increase property value',
      cost: 300,
      effects: {
        happinessBonus: 8,
        populationMultiplier: 1.2,
      },
    },
  ],
  
  shop_small: [
    {
      name: 'Neon Signs',
      description: 'Bright signs attract more customers',
      cost: 800,
      effects: {
        incomeMultiplier: 1.4,
        jobsMultiplier: 1.2,
      },
    },
    {
      name: 'Delivery Service',
      description: 'Online ordering and delivery increases revenue',
      cost: 1200,
      effects: {
        incomeMultiplier: 1.6,
        happinessBonus: 3,
      },
      requirements: {
        adjacentBuildings: ['road'],
      },
    },
  ],
  
  factory_small: [
    {
      name: 'Pollution Filters',
      description: 'Advanced filtration reduces environmental impact',
      cost: 2000,
      effects: {
        pollutionReduction: 10,
        happinessBonus: 5,
      },
    },
    {
      name: 'Automation',
      description: 'Robotic systems increase efficiency',
      cost: 3500,
      effects: {
        incomeMultiplier: 1.8,
        jobsMultiplier: 0.8, // Fewer jobs but more income
      },
    },
  ],
  
  park: [
    {
      name: 'Playground Equipment',
      description: 'Swings and slides make families happier',
      cost: 600,
      effects: {
        happinessBonus: 12,
        jobsMultiplier: 1.5,
      },
    },
    {
      name: 'Food Trucks',
      description: 'Mobile vendors provide snacks and jobs',
      cost: 400,
      effects: {
        jobsMultiplier: 2.0,
        incomeMultiplier: 1.3,
      },
    },
  ],
  
  hospital: [
    {
      name: 'Emergency Helicopter',
      description: 'Faster emergency response saves more lives',
      cost: 5000,
      effects: {
        happinessBonus: 15,
        jobsMultiplier: 1.3,
      },
    },
    {
      name: 'Research Wing',
      description: 'Medical research brings prestige and funding',
      cost: 8000,
      effects: {
        incomeMultiplier: 1.5,
        happinessBonus: 10,
        jobsMultiplier: 1.4,
      },
      requirements: {
        adjacentBuildings: ['university'],
      },
    },
  ],
  
  school: [
    {
      name: 'Computer Lab',
      description: 'Modern technology prepares students for the future',
      cost: 1500,
      effects: {
        happinessBonus: 8,
        jobsMultiplier: 1.2,
      },
    },
    {
      name: 'Sports Complex',
      description: 'Athletic facilities improve student health and happiness',
      cost: 2500,
      effects: {
        happinessBonus: 15,
        populationMultiplier: 1.1, // Attracts families
      },
    },
  ],
};

export function getAvailableUpgrades(
  buildingType: BuildingType, 
  building: Building,
  adjacentBuildings: BuildingType[],
  cityPopulation: number
): UpgradeOption[] {
  const upgrades = BUILDING_UPGRADES[buildingType] || [];
  
  return upgrades.filter(upgrade => {
    const req = upgrade.requirements;
    if (!req) return true;
    
    // Check level requirement
    if (req.minLevel && building.level < req.minLevel) return false;
    
    // Check adjacent buildings
    if (req.adjacentBuildings) {
      const hasRequired = req.adjacentBuildings.some(required => 
        adjacentBuildings.includes(required)
      );
      if (!hasRequired) return false;
    }
    
    // Check population requirement
    if (req.minPopulation && cityPopulation < req.minPopulation) return false;
    
    return true;
  });
}

export function applyUpgrade(building: Building, upgrade: UpgradeOption): Building {
  const upgraded = { ...building };
  
  // Apply effects (you'd need to track these in the building data)
  // This is a simplified version - you'd want to store upgrade effects
  upgraded.level = (upgraded.level || 1) + 1;
  
  return upgraded;
}