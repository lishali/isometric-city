'use client';

import React from 'react';
import { BuildingType, BUILDING_COSTS } from '../types/game';

interface ToolbarProps {
  selectedTool: BuildingType;
  onToolSelect: (tool: BuildingType) => void;
  money: number;
}

const TOOLS: BuildingType[] = ['house', 'shop', 'factory', 'road', 'park'];

export function Toolbar({ selectedTool, onToolSelect, money }: ToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-100 border-b">
      <button
        onClick={() => onToolSelect('empty')}
        className={`px-4 py-2 rounded ${
          selectedTool === 'empty' ? 'bg-red-500 text-white' : 'bg-white'
        }`}
      >
        Bulldoze (Free)
      </button>
      
      {TOOLS.map((tool) => {
        const cost = BUILDING_COSTS[tool];
        const canAfford = money >= cost;
        
        return (
          <button
            key={tool}
            onClick={() => onToolSelect(tool)}
            disabled={!canAfford}
            className={`px-4 py-2 rounded capitalize ${
              selectedTool === tool 
                ? 'bg-blue-500 text-white' 
                : canAfford 
                ? 'bg-white hover:bg-gray-50' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {tool} (${cost})
          </button>
        );
      })}
    </div>
  );
}