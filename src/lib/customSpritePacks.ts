// Custom Sprite Pack System - Loads user-provided assets
import { SpritePack } from '@/lib/renderConfig';

export interface CustomSpritePackConfig {
  id: string;
  name: string;
  description: string;
  author?: string;
  version?: string;
  basedOn?: string; // Which default pack this extends
  spriteSheet: string; // Path to main sprite sheet
  config: Partial<SpritePack>; // Override default config
}

// Custom sprite packs loaded from user assets
export const CUSTOM_SPRITE_PACKS: CustomSpritePackConfig[] = [];

/**
 * Load custom sprite packs from the custom assets folder
 * This checks for sprite packs in /public/assets/custom/
 */
export async function loadCustomSpritePacks(): Promise<CustomSpritePackConfig[]> {
  const customPacks: CustomSpritePackConfig[] = [];
  
  try {
    // Check if custom folder exists by trying to load a manifest
    const response = await fetch('/assets/custom/manifest.json');
    if (response.ok) {
      const manifest = await response.json();
      
      for (const packConfig of manifest.packs || []) {
        // Validate the pack has required fields
        if (packConfig.id && packConfig.name && packConfig.spriteSheet) {
          customPacks.push({
            ...packConfig,
            spriteSheet: `/assets/custom/${packConfig.spriteSheet}`,
          });
        }
      }
    }
  } catch (error) {
    console.log('No custom sprite packs found (this is normal)');
  }
  
  return customPacks;
}

/**
 * Convert a custom sprite pack config to a full SpritePack
 */
export function createSpritePackFromCustom(
  customConfig: CustomSpritePackConfig,
  basePack: SpritePack
): SpritePack {
  return {
    ...basePack,
    ...customConfig.config,
    id: customConfig.id,
    name: customConfig.name,
    src: customConfig.spriteSheet,
  };
}

/**
 * Check if custom assets folder exists and has valid sprite sheets
 */
export async function validateCustomAssets(): Promise<{
  hasCustomFolder: boolean;
  validPacks: string[];
  errors: string[];
}> {
  const result = {
    hasCustomFolder: false,
    validPacks: [] as string[],
    errors: [] as string[],
  };
  
  try {
    const response = await fetch('/assets/custom/manifest.json');
    if (response.ok) {
      result.hasCustomFolder = true;
      const manifest = await response.json();
      
      for (const pack of manifest.packs || []) {
        try {
          // Try to load the sprite sheet
          const spriteResponse = await fetch(`/assets/custom/${pack.spriteSheet}`);
          if (spriteResponse.ok) {
            result.validPacks.push(pack.name);
          } else {
            result.errors.push(`Sprite sheet not found: ${pack.spriteSheet}`);
          }
        } catch (error) {
          result.errors.push(`Error loading pack "${pack.name}": ${error}`);
        }
      }
    }
  } catch (error) {
    // No custom folder - this is fine
  }
  
  return result;
}