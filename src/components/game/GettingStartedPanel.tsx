'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Zap, Building, TreePine, DollarSign, Users } from 'lucide-react';

const QUICK_START_STEPS = [
  {
    icon: <Home className="h-5 w-5" />,
    title: 'Build Houses',
    description: 'Start with 3-4 small houses to create your first neighborhood',
    tool: 'house_small',
    cost: '$100 each',
  },
  {
    icon: <Building className="h-5 w-5" />,
    title: 'Connect with Roads',
    description: 'Build roads to connect your houses together',
    tool: 'road',
    cost: '$50 each',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Add Power Plant',
    description: 'Your city needs electricity to function properly',
    tool: 'power_plant',
    cost: '$1,000',
  },
  {
    icon: <TreePine className="h-5 w-5" />,
    title: 'Add Some Parks',
    description: 'Parks make your citizens happy and reduce pollution',
    tool: 'park',
    cost: '$150 each',
  },
];

export function GettingStartedPanel() {
  const { state, setTool, setActivePanel } = useGame();
  
  // Check if player has built basic infrastructure
  const hasHouses = state.grid.some(row => row.some(tile => tile.building.type === 'house_small'));
  const hasRoads = state.grid.some(row => row.some(tile => tile.building.type === 'road'));
  const hasPower = state.grid.some(row => row.some(tile => tile.building.type === 'power_plant'));
  
  const completedSteps = [hasHouses, hasRoads, hasPower, false].filter(Boolean).length;
  const isComplete = completedSteps >= 3;

  const handleSelectTool = (tool: string) => {
    setTool(tool as any);
    setActivePanel('none');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Getting Started</h2>
        <p className="text-muted-foreground">
          Follow these simple steps to build your first city
        </p>
        <Badge variant={isComplete ? "default" : "secondary"}>
          {completedSteps} of 4 steps completed
        </Badge>
      </div>

      <div className="space-y-4">
        {QUICK_START_STEPS.map((step, index) => {
          const isCompleted = index === 0 ? hasHouses : 
                             index === 1 ? hasRoads : 
                             index === 2 ? hasPower : false;
          
          return (
            <Card 
              key={step.title}
              className={`transition-all cursor-pointer hover:shadow-md ${
                isCompleted ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSelectTool(step.tool)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {step.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {step.title}
                        {isCompleted && <Badge className="bg-green-500">✓ Done</Badge>}
                      </CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{step.cost}</Badge>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {isComplete && (
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="text-2xl">🎉</div>
              <h3 className="font-semibold text-green-800">Great job!</h3>
              <p className="text-sm text-green-700">
                You've built the basics! Your city will now start generating population and income. 
                Explore the other tools to expand your city.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActivePanel('achievements')}
                >
                  <DollarSign className="h-4 w-4 mr-1" />
                  View Achievements
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActivePanel('statistics')}
                >
                  <Users className="h-4 w-4 mr-1" />
                  City Stats
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="text-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setActivePanel('none')}
        >
          Close Getting Started
        </Button>
      </div>
    </div>
  );
}