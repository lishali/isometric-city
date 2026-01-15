// Tutorial Mode - Simplifies the interface for new players
import { Tool } from '@/types/game';

// Essential tools for beginners
export const BEGINNER_TOOLS: Tool[] = [
  'zone_residential',
  'road', 
  'power_plant',
  'water_tower',
  'zone_commercial',
  'park',
  'bulldoze',
];

// Tools to show after completing basic tutorial
export const INTERMEDIATE_TOOLS: Tool[] = [
  ...BEGINNER_TOOLS,
  'zone_industrial',
  'police_station',
  'fire_station',
  'hospital',
  'school',
  'tree',
];

// All tools (advanced mode)
export const ALL_TOOLS: Tool[] = [
  // This would include all tools from TOOL_INFO
];

export type TutorialMode = 'beginner' | 'intermediate' | 'advanced';

export function getTutorialMode(): TutorialMode {
  if (typeof window === 'undefined') return 'beginner';
  
  const mode = localStorage.getItem('isocity-tutorial-mode');
  return (mode as TutorialMode) || 'beginner';
}

export function setTutorialMode(mode: TutorialMode) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('isocity-tutorial-mode', mode);
}

export function getAvailableTools(mode: TutorialMode): Tool[] {
  switch (mode) {
    case 'beginner':
      return BEGINNER_TOOLS;
    case 'intermediate':
      return INTERMEDIATE_TOOLS;
    case 'advanced':
    default:
      return ALL_TOOLS;
  }
}

export function shouldShowTool(tool: Tool, mode: TutorialMode): boolean {
  const availableTools = getAvailableTools(mode);
  return availableTools.includes(tool);
}