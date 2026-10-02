import React from 'react';
import { ShopItem, PlayerStats } from '../types';
import { IMAGES } from '../assets';
import { sound } from '../utils/audio';
import { X, Sparkles, Check, Coins, ShieldAlert } from 'lucide-react';
import { RobinHoodMascot } from './RobinHoodMascot';

interface QuiverShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopItems: ShopItem[];
  stats: PlayerStats;
  onBuyItem: (itemId: string) => void;
  onEquipItem: (itemId: string) => void;
}

export const QuiverShopModal: React.FC<QuiverShopModalProps> = ({
  isOpen,
  onClose,
  shopItems,
  stats,
  onBuyItem,
  onEquipItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-600/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950 via-slate-950 to-emerald-950 border-b border-amber-600/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-amber-500/70 shrink-0">
              <img
                src={IMAGES.quiverIcon}
                alt="Quiver Icon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-amber-300">
                Sherwood Armory & Quiver Forge
              </h2>
              <p className="text-xs text-amber-200/70">
                Upgrade bows, enchanted sights, and quivers with your tournament gold
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-950/80 border border-amber-500/60 rounded-xl text-amber-300 font-mono font-bold text-sm">
              <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{stats.gold} Gold</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <RobinHoodMascot
            compact
            mood="proud"
            message="Every bullseye and completed lesson fills our treasury! Select fine Nottingham gear to enhance your archery precision!"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => {
              const canAfford = stats.gold >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    item.equipped
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                      : item.purchased
                      ? 'bg-slate-800/60 border-slate-700'
                      : 'bg-slate-800/30 border-slate-750'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-base font-bold text-amber-300 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-300 mb-3 min-h-[36px]">
                      {item.description}
                    </p>

                    <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-750 text-[11px] text-emerald-300 font-medium mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{item.perk}</span>
                    </div>
                  </div>

                  <div>
                    {item.equipped ? (
                      <div className="w-full py-2 bg-emerald-600/30 border border-emerald-500/60 rounded-lg text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Equipped</span>
                      </div>
                    ) : item.purchased ? (
                      <button
                        onClick={() => {
                          onEquipItem(item.id);
                          sound.targetHit(true);
                        }}
                        className="w-full py-2 bg-slate-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Equip Gear
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (canAfford) {
                            onBuyItem(item.id);
                            sound.coin();
                          }
                        }}
                        disabled={!canAfford}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md cursor-pointer'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                        }`}
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Unlock for {item.cost} Gold</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Return to Tournament
          </button>
        </div>
      </div>
    </div>
  );
};
