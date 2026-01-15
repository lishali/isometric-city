'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GameCanvas } from '../components/GameCanvas';
import { Toolbar } from '../components/Toolbar';
import { GameState, BuildingType } from '../types/game';
import { createInitialGameState, placeBuilding, simulateTick } from '../lib/simulation';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());

  // Game simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prevState => simulateTick(prevState));
    }, 2000); // Tick every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleTileClick = useCallback((x: number, y: number) => {
    setGameState(prevState => 
      placeBuilding(prevState, x, y, prevState.selectedTool)
    );
  }, []);

  const handleToolSelect = useCallback((tool: BuildingType) => {
    setGameState(prevState => ({
      ...prevState,
      selectedTool: tool,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Simple City Builder</h1>
          <div className="flex gap-6 mt-2 text-sm text-gray-600">
            <span>Population: {gameState.population}</span>
            <span>Money: ${gameState.money}</span>
          </div>
        </div>
      </header>

      <Toolbar
        selectedTool={gameState.selectedTool}
        onToolSelect={handleToolSelect}
        money={gameState.money}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          <GameCanvas
            gameState={gameState}
            onTileClick={handleTileClick}
          />
        </div>
        
        <div className="mt-8 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-4">How to Play:</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Click on tiles to place buildings</li>
            <li>• Houses generate income, especially when near shops</li>
            <li>• Use the bulldoze tool to remove buildings (refunds 50%)</li>
            <li>• Build roads to connect your city</li>
            <li>• Add parks to make residents happy</li>
          </ul>
        </div>
      </main>
    </div>
  );
}