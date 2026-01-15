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
    description: 'This is your city grid. You can click and drag to move around, and scroll to zoom in/out. Try it now!',
    icon: <Building className="h-6 w-6" />,
    position: 'center',
    action: 'Try dragging the map around, then click "Next"',
  },
  {
    id: 'sidebar',
    title: 'Building Tools',
    description: 'The sidebar on the left contains all your building tools. Let\'s start with housing for your citizens.',
    icon: <Building className="h-6 w-6" />,
    position: 'center',
    target: '[data-tutorial="sidebar"]',
    action: 'Look at the highlighted sidebar, then click "Next"',
  },
  {
    id: 'select-house',
    title: 'Select Residential Zone',
    description: 'In the sidebar, look for "Residential" in the zones section. This will let you zone areas where houses can be built automatically.',
    icon: <Home className="h-6 w-6" />,
    position: 'center',
    target: '[data-tool="zone_residential"]',
    action: 'Click the highlighted "Residential" zone tool',
    condition: (state) => state.selectedTool === 'zone_residential',
  },
  {
    id: 'place-house',
    title: 'Zone Residential Area',
    description: 'Great! Now click on the green grass to create a residential zone. Houses will automatically appear in zoned areas over time.',
    icon: <Home className="h-6 w-6" />,
    position: 'center',
    action: 'Click on the grass to create residential zones',
    condition: (state) => {
      // Check if any residential zone has been placed
      for (const row of state.grid) {
        for (const tile of row) {
          if (tile.zone === 'residential') return true;
        }
      }
      return false;
    },
  },
  {
    id: 'place-more-houses',
    title: 'Zone More Areas',
    description: 'Excellent! Create 2-3 more residential zones to build a neighborhood. Each zone costs $50 and houses will appear automatically.',
    icon: <Home className="h-6 w-6" />,
    position: 'center',
    action: 'Create 2-3 more residential zones',
    condition: (state) => {
      let zoneCount = 0;
      for (const row of state.grid) {
        for (const tile of row) {
          if (tile.zone === 'residential') zoneCount++;
        }
      }
      return zoneCount >= 3;
    },
  },
  {
    id: 'select-road',
    title: 'Connect with Roads',
    description: 'Houses need roads to connect to each other. Find and click the road tool in the sidebar.',
    icon: <ArrowRight className="h-6 w-6" />,
    position: 'center',
    target: '[data-tool="road"]',
    action: 'Click the highlighted road tool',
    condition: (state) => state.selectedTool === 'road',
  },
  {
    id: 'place-roads',
    title: 'Build Roads',
    description: 'Perfect! Now connect your houses with roads. Click between houses to build road tiles.',
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
    id: 'tutorial-complete',
    title: 'Great Start!',
    description: 'Awesome! You\'ve built your first neighborhood. Your city will now start generating population and income. Try the "Getting Started" panel for more guidance!',
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

  // Create spotlight effect for targeted elements
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  
  useEffect(() => {
    if (!step.target) {
      setSpotlightRect(null);
      return;
    }
    
    const updateSpotlight = () => {
      const targetElement = document.querySelector(step.target!);
      if (targetElement) {
        setSpotlightRect(targetElement.getBoundingClientRect());
      }
    };
    
    // Initial update
    updateSpotlight();
    
    // Update on resize/scroll
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight);
    
    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight);
    };
  }, [step.target]);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {/* Semi-transparent backdrop only for first step */}
      {isFirstStep && (
        <div className="absolute inset-0 bg-black/30 pointer-events-auto" />
      )}
      
      {/* Spotlight effect for targeted elements */}
      {step.target && spotlightRect && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Dark overlay with cutout */}
          <div 
            className="absolute inset-0 bg-black/40"
            style={{
              clipPath: `polygon(0% 0%, 0% 100%, ${spotlightRect.left - 8}px 100%, ${spotlightRect.left - 8}px ${spotlightRect.top - 8}px, ${spotlightRect.right + 8}px ${spotlightRect.top - 8}px, ${spotlightRect.right + 8}px ${spotlightRect.bottom + 8}px, ${spotlightRect.left - 8}px ${spotlightRect.bottom + 8}px, ${spotlightRect.left - 8}px 100%, 100% 100%, 100% 0%)`
            }}
          />
          {/* Pulsing highlight ring */}
          <div
            className="absolute border-4 border-blue-400 rounded-lg animate-pulse pointer-events-none"
            style={{
              left: spotlightRect.left - 8,
              top: spotlightRect.top - 8,
              width: spotlightRect.width + 16,
              height: spotlightRect.height + 16,
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
            }}
          />
        </div>
      )}
      
      {/* Tutorial card positioned to not block interactions */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <Card className="w-80 shadow-2xl border-2 bg-white">
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
            
            {step.target && !step.condition && (
              <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                <p className="text-xs text-yellow-700">
                  💡 Look for the highlighted element on screen
                </p>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                className="text-gray-500"
                size="sm"
              >
                Skip Tutorial
              </Button>
              
              <div className="flex gap-2">
                {isFirstStep ? (
                  <Button onClick={handleStart} size="sm" className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Tutorial
                  </Button>
                ) : isLastStep ? (
                  <Button onClick={handleFinish} size="sm" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Finish
                  </Button>
                ) : step.condition ? (
                  <Button disabled size="sm" className="flex items-center gap-2">
                    Waiting for action...
                  </Button>
                ) : (
                  <Button onClick={handleNext} size="sm" className="flex items-center gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}