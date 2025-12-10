export interface Challenge {
  id: string;
  description: string;
  targetValue?: number;
  isCompleted: boolean;
}

export interface LevelData {
  id: number;
  name: string;
  theme: string;
  assets: {
    background: any; // require(...) ile gelen görsel
    plantPot: any;
  };
  requiredMinutes: number;
  challenges: Challenge[];
}

export interface UserState {
  currentLevelId: number;
  totalFocusMinutes: number;
  coins: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  type: 'pot' | 'plant' | 'background';
  image: any; // require()
}