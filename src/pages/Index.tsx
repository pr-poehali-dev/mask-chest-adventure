import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Mask {
  id: number;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  goldReward: number;
  chance: number;
  image: string;
}

const masks: Mask[] = [
  { id: 1, name: 'Белый Анонимус', rarity: 'common', goldReward: 50, chance: 40, image: 'https://cdn.poehali.dev/files/e8559049-2862-4fb6-a689-67cf68d2d10a.jpg' },
  { id: 2, name: 'Черный Анонимус', rarity: 'rare', goldReward: 100, chance: 25, image: 'https://cdn.poehali.dev/files/32a6e708-4b5c-46a6-af71-3c86267db6ed.jpg' },
  { id: 7, name: 'Комбинация Анонимус', rarity: 'rare', goldReward: 100, chance: 15, image: 'https://cdn.poehali.dev/files/e8559049-2862-4fb6-a689-67cf68d2d10a.jpg' },
  { id: 3, name: 'Неоновый Анонимус', rarity: 'epic', goldReward: 200, chance: 10, image: 'https://cdn.poehali.dev/files/70aaa8a5-19ef-4c40-b4f5-5b784225fcb4.jpg' },
  { id: 6, name: 'Огненно-Водяной Анонимус', rarity: 'epic', goldReward: 200, chance: 5, image: 'https://cdn.poehali.dev/files/70aaa8a5-19ef-4c40-b4f5-5b784225fcb4.jpg' },
  { id: 4, name: 'Золотой Анонимус', rarity: 'legendary', goldReward: 320, chance: 3, image: 'https://cdn.poehali.dev/files/2c5000ad-ab3b-4341-8d10-500f73ac5f3c.jpg' },
  { id: 5, name: 'Радужный Анонимус', rarity: 'legendary', goldReward: 320, chance: 2, image: 'https://cdn.poehali.dev/files/16a1ac52-4548-4445-a1d5-d6aee923ea7d.jpg' },
];

const rarityColors = {
  common: 'text-gray-300',
  rare: 'text-purple-400',
  epic: 'text-purple-500',
  legendary: 'text-yellow-400',
};

const rarityGlow = {
  common: '',
  rare: 'glow-purple',
  epic: 'glow-purple',
  legendary: 'glow-gold',
};

const rarityBg = {
  common: 'from-gray-700 to-gray-800',
  rare: 'from-purple-900 to-purple-950',
  epic: 'from-purple-700 to-purple-900',
  legendary: 'from-yellow-600 to-yellow-800',
};

const Index = () => {
  const [gold, setGold] = useState(() => {
    const saved = localStorage.getItem('gold');
    return saved ? parseInt(saved) : 500;
  });
  
  const [collection, setCollection] = useState<number[]>(() => {
    const saved = localStorage.getItem('collection');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isOpening, setIsOpening] = useState(false);
  const [currentMask, setCurrentMask] = useState<Mask | null>(null);
  const [activeTab, setActiveTab] = useState<'main' | 'collection'>('main');
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const lastLogin = localStorage.getItem('lastLogin');
    const today = new Date().toDateString();
    
    if (lastLogin !== today) {
      setGold(prev => prev + 120);
      localStorage.setItem('lastLogin', today);
      setShowDailyBonus(true);
      
      toast({
        title: '🎁 Ежедневный бонус!',
        description: '+120 золота за вход в игру',
        duration: 5000,
      });
      
      setTimeout(() => setShowDailyBonus(false), 3000);
    }
  }, [toast]);

  useEffect(() => {
    localStorage.setItem('gold', gold.toString());
  }, [gold]);

  useEffect(() => {
    localStorage.setItem('collection', JSON.stringify(collection));
  }, [collection]);

  const openCase = () => {
    if (gold < 80) {
      toast({
        title: '❌ Недостаточно золота',
        description: 'Нужно 80 золота для открытия кейса',
        variant: 'destructive',
      });
      return;
    }

    setIsOpening(true);
    setGold(gold - 80);

    setTimeout(() => {
      const random = Math.random() * 100;
      let cumulativeChance = 0;
      let droppedMask: Mask | null = null;

      for (const mask of masks) {
        cumulativeChance += mask.chance;
        if (random <= cumulativeChance) {
          droppedMask = mask;
          break;
        }
      }

      if (droppedMask) {
        setCurrentMask(droppedMask);
        setGold(prev => prev + droppedMask.goldReward);
        
        if (!collection.includes(droppedMask.id)) {
          setCollection([...collection, droppedMask.id]);
        }

        toast({
          title: `🎭 ${droppedMask.name}`,
          description: `+${droppedMask.goldReward} золота`,
        });
      }

      setIsOpening(false);
    }, 2000);
  };

  const rarityName = {
    common: 'Обычный',
    rare: 'Редкий',
    epic: 'Эпический',
    legendary: 'Легендарный',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A0F] via-[#0F0F1A] to-[#0A0A0F] text-white p-4">
      {showDailyBonus && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-secondary/90 to-primary/90 px-12 py-8 rounded-2xl border-4 border-secondary animate-fade-in shadow-2xl">
            <div className="text-center space-y-3">
              <Icon name="Gift" size={64} className="mx-auto text-background animate-float" />
              <h2 className="text-4xl font-bold text-background glow-gold">+120 ЗОЛОТА</h2>
              <p className="text-xl text-background/90">Ежедневный бонус!</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8 p-4 bg-card rounded-lg border border-primary/20 card-glow">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold glow-green flex items-center gap-2">
              <Icon name="Zap" className="animate-pulse-glow" />
              ANONYMOUS CASES
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-lg border border-secondary/40">
              <Icon name="Coins" className="text-secondary" />
              <span className="text-2xl font-bold text-secondary glow-gold">{gold}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveTab(activeTab === 'main' ? 'collection' : 'main')}
              className="hover:bg-primary/20"
            >
              <Icon name={activeTab === 'main' ? 'BookOpen' : 'Home'} />
            </Button>
          </div>
        </header>

        {activeTab === 'main' ? (
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center gap-8 py-12">
              <Card className="w-full max-w-md p-8 bg-gradient-to-br from-card via-card/80 to-card border-2 border-primary/30 relative overflow-hidden">
                {isOpening && (
                  <div className="absolute inset-0 bg-primary/10 animate-pulse-glow z-10" />
                )}
                
                <div className="relative aspect-square mb-6 flex items-center justify-center">
                  {currentMask ? (
                    <div className="animate-fade-in">
                      <img 
                        src={currentMask.image} 
                        alt={currentMask.name}
                        className={`w-64 h-64 object-cover rounded-lg border-4 ${
                          currentMask.rarity === 'legendary' ? 'border-secondary' :
                          currentMask.rarity === 'epic' ? 'border-accent' :
                          currentMask.rarity === 'rare' ? 'border-purple-500' :
                          'border-gray-500'
                        } shadow-2xl animate-float`}
                      />
                    </div>
                  ) : (
                    <div className={`w-64 h-64 bg-gradient-to-br from-muted to-card rounded-lg border-2 border-dashed border-primary/40 flex items-center justify-center ${isOpening ? 'animate-glitch' : ''}`}>
                      <Icon name="Gift" size={96} className="text-primary/40" />
                    </div>
                  )}
                </div>

                {currentMask && (
                  <div className="text-center space-y-2 animate-fade-in">
                    <h3 className={`text-2xl font-bold ${rarityColors[currentMask.rarity]} ${rarityGlow[currentMask.rarity]}`}>
                      {currentMask.name}
                    </h3>
                    <Badge className={`bg-gradient-to-r ${rarityBg[currentMask.rarity]}`}>
                      {rarityName[currentMask.rarity]}
                    </Badge>
                    <p className="text-secondary text-lg">+{currentMask.goldReward} золота</p>
                  </div>
                )}

                <Button
                  onClick={openCase}
                  disabled={isOpening || gold < 80}
                  className="w-full mt-6 h-14 text-lg font-bold bg-primary hover:bg-primary/80 text-background glow-green"
                >
                  {isOpening ? (
                    <>
                      <Icon name="Loader2" className="animate-spin mr-2" />
                      Открываем...
                    </>
                  ) : (
                    <>
                      <Icon name="Unlock" className="mr-2" />
                      Открыть кейс (80 золота)
                    </>
                  )}
                </Button>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                {masks.map(mask => (
                  <Card 
                    key={mask.id}
                    className={`p-4 bg-gradient-to-br ${rarityBg[mask.rarity]} border-2 ${
                      collection.includes(mask.id) ? 'border-primary/50' : 'border-muted/20 opacity-50'
                    } transition-all hover:scale-105`}
                  >
                    <div className="aspect-square mb-2 rounded overflow-hidden">
                      <img 
                        src={mask.image} 
                        alt={mask.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className={`text-xs font-bold text-center ${rarityColors[mask.rarity]} mb-1`}>
                      {mask.name}
                    </h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{mask.chance}%</span>
                      <span className="text-secondary font-bold">+{mask.goldReward}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold glow-green">Коллекция масок</h2>
              <div className="text-muted-foreground">
                Собрано: {collection.length} / {masks.length}
              </div>
            </div>
            
            <Progress value={(collection.length / masks.length) * 100} className="h-3" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {masks.map(mask => {
                const isCollected = collection.includes(mask.id);
                return (
                  <Card 
                    key={mask.id}
                    className={`p-6 bg-gradient-to-br ${rarityBg[mask.rarity]} border-2 ${
                      isCollected ? 'border-primary/50 card-glow' : 'border-muted/20 grayscale'
                    }`}
                  >
                    <div className="aspect-square mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={mask.image} 
                        alt={mask.name}
                        className={`w-full h-full object-cover ${!isCollected ? 'opacity-30' : ''}`}
                      />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${rarityColors[mask.rarity]} ${isCollected ? rarityGlow[mask.rarity] : ''}`}>
                      {isCollected ? mask.name : '???'}
                    </h3>
                    <Badge className={`bg-gradient-to-r ${rarityBg[mask.rarity]} mb-2`}>
                      {rarityName[mask.rarity]}
                    </Badge>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Шанс: {mask.chance}%</span>
                      <span className="text-secondary font-bold">+{mask.goldReward} золота</span>
                    </div>
                    {!isCollected && (
                      <p className="text-xs text-muted-foreground mt-2">Ещё не получена</p>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
