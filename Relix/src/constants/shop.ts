import { Product } from '../types';

export const SHOP_ITEMS: Product[] = [
  {
    id: 'pot_clay',
    name: 'Kil Saksı',
    price: 0, // Başlangıç eşyası
    type: 'pot',
    image: require('../assets/images/plant_pot_empty.png'),
  },
  {
    id: 'pot_premium',
    name: 'Altın Saksı',
    price: 50, // 50 Coin
    type: 'pot',
    // Şimdilik aynısı, ama sen ileride farklı resim koyacaksın
    image: require('../assets/images/plant_pot_empty.png'), 
  },
  {
    id: 'bg_night',
    name: 'Gece Modu',
    price: 100,
    type: 'background',
    // Şimdilik aynısı
    image: require('../assets/images/bg_level_1.jpg'),
  }
];