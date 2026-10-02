/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameMode, PlayerStats, ShopItem } from './types';
import { INITIAL_SHOP_ITEMS } from './data/level2Challenges';
import { Header } from './components/Header';
import { MainMenu } from './components/MainMenu';
import { Level1Module } from './components/Level1Module';
import { Level2Archery } from './components/Level2Archery';
import { QuiverShopModal } from './components/QuiverShopModal';
import { DefinitionsGlossaryModal } from './components/DefinitionsGlossaryModal';
import { sound } from './utils/audio';

const STORAGE_KEY_STATS = 'mathhood_player_stats_v1';
const STORAGE_KEY_SHOP = 'mathhood_shop_items_v1';

const DEFAULT_STATS: PlayerStats = {
  gold: 100, // starting gold for welcoming the player
  level1Completed: false,
  currentSlide: 1,
  level2Score: 0,
  arrowsFired: 0,
  bullseyes: 0,
  streak: 0,
  highestStreak: 0,
  equippedBow: 'bow_basic',
  equippedQuiver: 'quiver_basic',
  hasTrajectoryGuide: false,
  hasTargetGlow: false,
  goldMultiplier: 1.0,
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('MENU');
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load stats from localStorage
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_STATS;
  });

  // Load shop items from localStorage
  const [shopItems, setShopItems] = useState<ShopItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SHOP);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SHOP_ITEMS;
  });

  // Save stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Save shop to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SHOP, JSON.stringify(shopItems));
    } catch {
      // ignore
    }
  }, [shopItems]);

  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.enabled = nextVal;
  };

  const handleRewardGold = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      gold: prev.gold + amount,
    }));
  };

  const handleCompleteLevel1 = () => {
    setStats((prev) => ({
      ...prev,
      level1Completed: true,
      gold: prev.gold + 100, // bonus for finishing all slides
    }));
  };

  const handleBuyShopItem = (itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item || stats.gold < item.cost) return;

    setStats((prev) => ({
      ...prev,
      gold: prev.gold - item.cost,
    }));

    setShopItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, purchased: true } : i))
    );

    // Auto-equip upon purchase
    handleEquipShopItem(itemId);
  };

  const handleEquipShopItem = (itemId: string) => {
    const targetItem = shopItems.find((i) => i.id === itemId);
    if (!targetItem) return;

    setShopItems((prev) =>
      prev.map((i) => {
        if (i.category === targetItem.category) {
          return { ...i, equipped: i.id === itemId };
        }
        return i;
      })
    );

    setStats((prev) => {
      let trajGuide = prev.hasTrajectoryGuide;
      let targetGlow = prev.hasTargetGlow;
      let goldMult = prev.goldMultiplier;

      if (itemId === 'bow_silver') trajGuide = true;
      if (itemId === 'sight_eagle') targetGlow = true;
      if (itemId === 'quiver_golden') goldMult = 1.5;

      return {
        ...prev,
        equippedBow: targetItem.category === 'bow' ? itemId : prev.equippedBow,
        equippedQuiver: targetItem.category === 'quiver' ? itemId : prev.equippedQuiver,
        hasTrajectoryGuide: trajGuide,
        hasTargetGlow: targetGlow,
        goldMultiplier: goldMult,
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        stats={stats}
        onOpenShop={() => setIsShopOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {currentMode === 'MENU' && (
          <MainMenu
            onSelectMode={(mode) => setCurrentMode(mode)}
            onOpenShop={() => setIsShopOpen(true)}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
            stats={stats}
          />
        )}

        {currentMode === 'LEVEL_1_LEARN' && (
          <Level1Module
            onCompleteModule={handleCompleteLevel1}
            onRewardGold={handleRewardGold}
            onGoToLevel2={() => setCurrentMode('LEVEL_2_ARCHERY')}
          />
        )}

        {currentMode === 'LEVEL_2_ARCHERY' && (
          <Level2Archery
            stats={stats}
            onUpdateStats={setStats}
            onOpenShop={() => setIsShopOpen(true)}
          />
        )}
      </main>

      {/* Armory / Quiver Shop Modal */}
      <QuiverShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        shopItems={shopItems}
        stats={stats}
        onBuyItem={handleBuyShopItem}
        onEquipItem={handleEquipShopItem}
      />

      {/* Definitions Glossary Modal */}
      <DefinitionsGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Subtle Footer */}
      <footer className="py-4 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500 font-cinzel">
        Math Hood: Arrows of Logic · Sherwood Forest Mathematical Academy
      </footer>
    </div>
  );
}
