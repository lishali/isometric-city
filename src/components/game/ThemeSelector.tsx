'use client';

import { useGame } from '@/context/GameContext';
import { SPRITE_PACKS } from '@/lib/renderConfig';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, Check, X } from 'lucide-react';

export function ThemeSelector() {
  const { currentSpritePack, setSpritePack, setActivePanel } = useGame();

  const themeCategories = {
    'Default Themes': SPRITE_PACKS.filter(pack => 
      ['sprites4', 'sprites4-harry', 'sprites4-china'].includes(pack.id)
    ),
    'Themed Worlds': SPRITE_PACKS.filter(pack => 
      ['candy_land', 'cyberpunk_city', 'fantasy_kingdom', 'japanese_town', 'medieval_village', 'space_colony', 'steampunk_city', 'tropical_resort', 'underwater_city', 'wild_west_town'].includes(pack.id)
    ),
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActivePanel('none')}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Palette className="h-6 w-6 text-blue-500" />
            City Themes
          </h2>
          <p className="text-muted-foreground">
            Choose a visual theme for your city buildings
          </p>
          <Badge variant="secondary">
            Current: {currentSpritePack.name}
          </Badge>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {Object.entries(themeCategories).map(([category, packs]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {packs.map((pack) => {
                  const isActive = currentSpritePack.id === pack.id;
                  
                  return (
                    <Card 
                      key={pack.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isActive ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSpritePack(pack.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {pack.name}
                            {isActive && <Check className="h-4 w-4 text-blue-500" />}
                          </CardTitle>
                          {isActive && (
                            <Badge className="bg-blue-500">Active</Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <CardDescription className="mb-3">
                          {getThemeDescription(pack.id)}
                        </CardDescription>
                        
                        {/* Preview image */}
                        <div className="w-full h-24 bg-gray-100 rounded border overflow-hidden">
                          {pack.individualSprites ? (
                            // Show a grid of individual sprites for themed packs
                            <div className="grid grid-cols-3 gap-1 p-1 h-full">
                              {Object.entries(pack.individualSprites).slice(0, 6).map(([key, src]) => (
                                <div key={key} className="bg-white rounded overflow-hidden">
                                  <img 
                                    src={src} 
                                    alt={key}
                                    className="w-full h-full object-cover"
                                    style={{ imageRendering: 'pixelated' }}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            // Show single sprite sheet preview for default themes
                            <img 
                              src={pack.src} 
                              alt={`${pack.name} preview`}
                              className="w-full h-full object-cover object-top"
                              style={{ imageRendering: 'pixelated' }}
                            />
                          )}
                        </div>
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {pack.cols}×{pack.rows} sprites
                          </span>
                          <Button 
                            size="sm" 
                            variant={isActive ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSpritePack(pack.id);
                            }}
                          >
                            {isActive ? 'Active' : 'Select'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
          
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              Themes change the visual appearance of all buildings in your city
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function getThemeDescription(packId: string): string {
  const descriptions: Record<string, string> = {
    'sprites4': 'Modern city with clean, contemporary buildings',
    'sprites4-harry': 'Magical buildings inspired by the wizarding world',
    'sprites4-china': 'Traditional Chinese architecture and styling',
    'candy_land': 'Sweet candy-themed buildings in a sugary wonderland',
    'cyberpunk_city': 'Futuristic neon-lit cyberpunk metropolis',
    'fantasy_kingdom': 'Medieval fantasy realm with magical architecture',
    'japanese_town': 'Traditional Japanese buildings and pagodas',
    'medieval_village': 'Historic medieval castles and village structures',
    'space_colony': 'Futuristic space station and sci-fi buildings',
    'steampunk_city': 'Victorian steampunk with brass and gears',
    'tropical_resort': 'Beach paradise with tropical island buildings',
    'underwater_city': 'Atlantis-style underwater civilization',
    'wild_west_town': 'Western frontier saloons and frontier buildings',
    'medieval': 'Medieval castles, cottages, and ancient structures',
    'classical': 'Greek and Roman inspired classical architecture',
    'enlightenment': 'Renaissance and Baroque period buildings',
    'industrial': 'Industrial revolution era factories and structures',
    'modern_age': 'Contemporary and futuristic city designs',
  };
  
  return descriptions[packId] || 'Custom themed buildings and structures';
}