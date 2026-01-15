'use client';

import React from 'react';
import { useGame } from '@/context/GameContext';
import { AchievementWithProgress, getAchievementProgress } from '@/lib/achievements';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Star, Target } from 'lucide-react';

export function AchievementPanel() {
  const { state } = useGame();
  const achievements = getAchievementProgress(state);
  
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievements
          </h2>
          <p className="text-muted-foreground">
            {unlockedCount} of {totalCount} achievements unlocked ({completionPercentage}%)
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          {completionPercentage}%
        </Badge>
      </div>

      <Progress value={completionPercentage} className="h-3" />

      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function AchievementCard({ achievement }: { achievement: AchievementWithProgress }) {
  const isUnlocked = achievement.unlocked;
  const progressData = achievement.progress;
  const hasProgress = progressData && progressData.target > 0;
  
  return (
    <Card className={`transition-all ${isUnlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'opacity-75'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${isUnlocked ? 'grayscale-0' : 'grayscale'}`}>
              {achievement.icon}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {achievement.name}
                {isUnlocked && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
              </CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </div>
          </div>
          {isUnlocked && (
            <Badge variant="default" className="bg-green-500">
              Unlocked!
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {hasProgress && !isUnlocked && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                Progress
              </span>
              <span className="font-mono">
                {progressData!.current.toLocaleString()} / {progressData!.target.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={(progressData!.current / progressData!.target) * 100} 
              className="h-2"
            />
          </div>
        )}
        
        {isUnlocked && achievement.reward && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-1">Rewards Earned:</h4>
            <div className="text-sm text-green-700 space-y-1">
              {achievement.reward.money && (
                <div>💰 ${achievement.reward.money.toLocaleString()}</div>
              )}
              {achievement.reward.happinessBonus && (
                <div>😊 +{achievement.reward.happinessBonus} Happiness</div>
              )}
              {achievement.reward.title && (
                <div>🏆 Title: "{achievement.reward.title}"</div>
              )}
              {achievement.reward.unlocksBuilding && (
                <div>🏗️ Unlocked: {achievement.reward.unlocksBuilding.replace(/_/g, ' ')}</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}