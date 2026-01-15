'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { GameState, BuildingType, BUILDING_COLORS } from '../types/game';

interface GameCanvasProps {
  gameState: GameState;
  onTileClick: (x: number, y: number) => void;
}

const TILE_SIZE = 40;

export function GameCanvas({ gameState, onTileClick }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    const { grid } = gameState;
    
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw tiles
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x];
        const screenX = x * TILE_SIZE;
        const screenY = y * TILE_SIZE;
        
        // Fill tile with building color
        ctx.fillStyle = BUILDING_COLORS[tile.building];
        ctx.fillRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        
        // Draw border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX, screenY, TILE_SIZE, TILE_SIZE);
        
        // Draw building icon/text
        if (tile.building !== 'empty') {
          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            tile.building[0].toUpperCase(),
            screenX + TILE_SIZE / 2,
            screenY + TILE_SIZE / 2 + 4
          );
        }
      }
    }
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    drawGrid(ctx);
  }, [drawGrid]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((event.clientY - rect.top) / TILE_SIZE);
    
    if (x >= 0 && x < gameState.gridSize && y >= 0 && y < gameState.gridSize) {
      onTileClick(x, y);
    }
  }, [gameState.gridSize, onTileClick]);

  return (
    <canvas
      ref={canvasRef}
      width={gameState.gridSize * TILE_SIZE}
      height={gameState.gridSize * TILE_SIZE}
      onClick={handleCanvasClick}
      className="border border-gray-300 cursor-pointer"
    />
  );
}