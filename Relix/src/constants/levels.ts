import { LevelData, Challenge } from '../types';

export const LEVELS: LevelData[] & { challenges: Challenge[] }[] = [
  {
    id: 1,
    name: "The Window Sill",
    theme: "Indoor",
    assets: {
      background: require('../assets/images/bg_level_1.jpg'),
      plantPot: require('../assets/images/plant_pot_empty.png'),
    },
    requiredMinutes: 10, // Test için 10 dk (Normalde 120)
    challenges: [
      { 
        id: 'c1_1', 
        description: "İlk başarılı odaklanmanı tamamla.", 
        targetValue: 1, 
        isCompleted: false 
      }
    ]
  },
  {
    id: 2,
    name: "The Balcony",
    theme: "Outdoor",
    assets: {
      background: require('../assets/images/bg_level_1.jpg'), // Şimdilik aynı
      plantPot: require('../assets/images/plant_pot_empty.png'),
    },
    requiredMinutes: 300,
    challenges: [
      { 
        id: 'c2_1', 
        description: "Toplam 5 kez odaklan.", 
        targetValue: 5, 
        isCompleted: false 
      }
    ]
  },
];