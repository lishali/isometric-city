'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ArrowDown, ArrowLeft, CheckCircle, Play, Home, Building, Zap } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  target?: string; // CSS selector for highlighting
  position: 'center' | 'left' | 'right' | 'top' | 'bottom';
  condition?: (state: any) => boolean; // When to auto-advance
  action?: string; // What the user should do
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to IsoCity!',
    description: 'Let\'s build your first city together. This tutorial will guide you through the basics.',
    icon: <Home className="h-6 w-6" />,
    position: 'center',
    action: 'Click "Start Tutorial" to begin',
  },
  {
    id: 'overview',
    title: 'Your City View',
    description: 'This is your city grid. You can click and drag to move around, and scroll to zoom in/out.',
    icon: <Building className="h-6 w-6" />,
    position: 'center',
    action: 'Try dragging the map around, then click "Next"',
  },
  {
    id: 'sidebar',
    title: 'Building Tools',
    description: 'The sidebar contains all your building tools. Let\'s start with the basics - housing for your citizens.',
    icon: <Building className="h-6 w-6" />,
    target: '.sidebar', // Assuming sidebar has this class
    position: 'right',
    action: 'Look at the sidebar on the left',
  },
  {
    id: 'select-house',
    title: 'Select House Tool',
    description: 'Click on the house icon to select it. Houses provide homes for your citizens.',
    icon: <Home className="h-6 w-6" />,
    position: 'right',
    action: 'Click the house tool in the sidebar',
    condition: (state) => state.selectedTool === 'house_small',
  },
  {
    id: 'place-house',
    title: 'Place Your First House',
    description: 'Now click anywhere on the green grass to place a house. This will be your first building!',
    icon: <Home className="h-6 w-6" />,
    position: 'center',
    action: 'Click on the grass to place a house',
    condition: (state) => {
      // Check if any house has been placed
      for (const row of state.grid) {
        for (const tile of row) {
          if (tile.building.type === 'house_small') return true;
        }
      }
      return false;
    },
  },
  {
    id: 'place-more-houses',
    title: 'Build More Houses',
    description: 'Great! Place 2-3 more houses to create a small neighborhood. Each house costs $100.',
    icon: <Home className="h-6 w-6" />,
    position: 'center',
    action: 'Place 2-3 more houses',
    condition: (state) => {
      let houseCount = 0;
      for (const row of state.grid) {
        for (const tile of row) {
          if (tile.building.type === 'house_small') houseCount++;
        }
      }
      return houseCount >= 3;
    },
  },
  {
    id: 'select-road',
    title: 'Connect with Roads',
    description: 'Houses need roads to connect to each other. Select the road tool.',
    icon: <ArrowRight className="h-6 w-6" />,
    position: 'right',
    action: 'Click the road tool in the sidebar',
    condition: (state) => state.selectedTool === 'road',
  },
  {
    id: 'place-roads',
    title: 'Build Roads',
    description: 'Connect your houses with roads. You can drag to build multiple road tiles at once!',
    icon: <ArrowRight className="h-6 w-6" />,
    position: 'center',
    action: 'Build roads connecting your houses',
    condition: (state) => {
      let roadCount = 0;
      for (const row of state.grid) {
        for (const tile of row) {
          if (tile.building.type === 'road') roadCount++;
        }
      }
      return roadCount >= 3;
    },
  },
  {
    id: 'add-power',
    title: 'Power Your City',
    description: 'Your city needs electricity! Build a power plant to provide power to your buildings.',
    icon: <Zap className="h-6 w-6" />,
    position: 'right',
    action: 'Find and click the power plant tool',
    condition: (state) => state.selectedTool === 'power_plant',
  },
  {
    id: 'place-power',
    title: 'Place Power Plant',
    description: 'Place the power plant somewhere near your houses. It\'s a 2x2 building, so make sure there\'s space!',
    icon: <Zap className="h-6 w-6" />,
    position: 'center',
    action: 'Click to place the power plant',
    condition: (state) => {
      for (const row of state.grid) {
        for (const tile of row) {
          if (tile.building.type === 'power_plant') return true;
        }
      }
      return false;
    },
  },
  {
    id: 'tutorial-complete',
    title: 'Tutorial Complete!',
    description: 'Congratulations! You\'ve built your first neighborhood. Your city will now start generating population and income. Explore the other tools and build your dream city!',
    icon: <CheckCircle className="h-6 w-6" />,
    position: 'center',
    action: 'Click "Finish" to start playing',
  },
];

export function TutorialOverlay() {
  const { state } = useGame();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false);

  // Check if this is a new player (no buildings placed)
  useEffect(() => {
    const hasBuildings = state.grid.some(row => 
      row.some(tile => 
        tile.building.type !== 'empty' && 
        tile.building.type !== 'grass' && 
        tile.building.type !== 'water' &&
        tile.building.type !== 'tree'
      )
    );
    
    const tutorialSeen = localStorage.getItem('isocity-tutorial-seen');
    
    if (!hasBuildings && !tutorialSeen && !hasSeenTutorial) {
      setIsActive(true);
    }
  }, [state.grid, hasSeenTutorial]);

  // Auto-advance when conditions are met
  useEffect(() => {
    if (!isActive) return;
    
    const step = TUTORIAL_STEPS[currentStep];
    if (step.condition && step.condition(state)) {
      setTimeout(() => {
        if (currentStep < TUTORIAL_STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 1000); // Small delay to let user see the result
    }
  }, [state, currentStep, isActive]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setIsActive(false);
    setHasSeenTutorial(true);
    localStorage.setItem('isocity-tutorial-seen', 'true');
  };

  const handleFinish = () => {
    setIsActive(false);
    setHasSeenTutorial(true);
    localStorage.setItem('isocity-tutorial-seen', 'true');
  };

  const handleStart = () => {
    setCurrentStep(1);
  };

  if (!isActive) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                {step.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <Badge variant="secondary" className="mt-1">
                  Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CardDescription className="text-base leading-relaxed">
            {step.description}
          </CardDescription>
          
          {step.action && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">
                👆 {step.action}
              </p>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="text-gray-500"
            >
              Skip Tutorial
            </Button>
            
            <div className="flex gap-2">
              {isFirstStep ? (
                <Button onClick={handleStart} className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Start Tutorial
                </Button>
              ) : isLastStep ? (
                <Button onClick={handleFinish} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Finish
                </Button>
              ) : step.condition ? (
                <Button disabled className="flex items-center gap-2">
                  Waiting for action...
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex items-center gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}