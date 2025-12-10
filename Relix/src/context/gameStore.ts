import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../utils/storage';
import { LEVELS } from '../constants/levels';
import { Alert } from 'react-native';

type GameStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

interface GameState {
    // Kalıcı Veriler (Veritabanına yazılacak)
    totalFocusMinutes: number;
    coins: number;
    currentLevelId: number;
    completedChallengeIds: string[];
    inventory: string[];
    buyItem: (itemId: string, price: number) => boolean;
    selectedPotId: string;
    equipItem: (itemId: string) => void;

    // Geçici Veriler (Sadece o anlık seans için)
    timeLeft: number;
    initialDuration: number;
    status: GameStatus;

    // Aksiyonlar
    startSession: (minutes: number) => void;
    stopSession: () => void;
    tick: () => void;
    failSession: () => void;
    completeSession: () => void;
    resetProgress: () => void; // Test için sıfırlama butonu
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            // Başlangıç Değerleri
            totalFocusMinutes: 0,
            coins: 0,
            currentLevelId: 1,
            timeLeft: 25 * 60,
            initialDuration: 25 * 60,
            status: 'idle',
            completedChallengeIds: [],
            inventory: ['pot_clay'],
            selectedPotId: 'pot_clay',

            equipItem: (itemId) => {
                // Sadece saksı değişimi yapıyoruz (İleride background da eklenebilir)
                set({ selectedPotId: itemId });
            },

            startSession: (minutes: number) => {
                const durationInSeconds = minutes * 60;
                set({
                    status: 'running',
                    timeLeft: durationInSeconds,
                    initialDuration: durationInSeconds
                });
            },

            stopSession: () => set({ status: 'idle', timeLeft: 25 * 60 }),

            tick: () => {
                const { timeLeft, status } = get();
                if (status !== 'running') return;

                if (timeLeft > 0) {
                    set({ timeLeft: timeLeft - 1 });
                } else {
                    get().completeSession();
                }
            },

            failSession: () => set({ status: 'failed' }),

            buyItem: (itemId, price) => {
                const { coins, inventory } = get();

                // 1. Zaten var mı?
                if (inventory.includes(itemId)) return false;

                // 2. Para yetiyor mu?
                if (coins < price) return false;

                // 3. Satın al!
                set({
                    coins: coins - price,
                    inventory: [...inventory, itemId]
                });
                return true; // İşlem başarılı
            },

            completeSession: () => {
                const { initialDuration, totalFocusMinutes, coins, currentLevelId, completedChallengeIds } = get();

                const sessionMinutes = Math.ceil(initialDuration / 60);
                const earnedCoins = sessionMinutes + 10;
                const newTotalMinutes = totalFocusMinutes + sessionMinutes;

                // --- GÖREV KONTROLÜ (CHALLENGE LOGIC) ---
                const currentLevelConfig = LEVELS.find(l => l.id === currentLevelId);
                let newCompletedIds = [...completedChallengeIds];

                if (currentLevelConfig && currentLevelConfig.challenges) {
                    currentLevelConfig.challenges.forEach(challenge => {
                        // Eğer görev zaten yapıldıysa geç
                        if (newCompletedIds.includes(challenge.id)) return;

                        // ÖRNEK GÖREV MANTIĞI: "İlk seansı tamamla" (c1_1)
                        if (challenge.id === 'c1_1') {
                            // Zaten şu an bitirdik, yani görev tamamlandı!
                            newCompletedIds.push(challenge.id);
                            Alert.alert("Görev Başarılı!", challenge.description);
                        }

                        // Buraya ileride diğer görev tipleri eklenecek (Örn: Streak)
                    });
                }

                // --- LEVEL UP KONTROLÜ ---
                let newLevelId = currentLevelId;
                const nextLevelConfig = LEVELS.find(l => l.id === currentLevelId + 1);

                if (currentLevelConfig && nextLevelConfig) {
                    // 1. Süre Yetti mi?
                    const isTimeEnough = newTotalMinutes >= currentLevelConfig.requiredMinutes;

                    // 2. Tüm Görevler Bitti mi?
                    const allChallengesDone = currentLevelConfig.challenges.every(ch =>
                        newCompletedIds.includes(ch.id)
                    );

                    if (isTimeEnough && allChallengesDone) {
                        newLevelId = nextLevelConfig.id;
                        Alert.alert("LEVEL UP! 🚀", `Yeni Bölüm: ${nextLevelConfig.name}`);
                    }
                }

                set({
                    status: 'completed',
                    totalFocusMinutes: newTotalMinutes,
                    coins: coins + earnedCoins,
                    currentLevelId: newLevelId,
                    completedChallengeIds: newCompletedIds,
                });
            },

            resetProgress: () => set({ totalFocusMinutes: 0, coins: 0, currentLevelId: 1 }),
        }),
        {
            name: 'relix-game-storage', // Veritabanındaki dosya adı
            storage: createJSONStorage(() => zustandStorage), // MMKV adaptörü
            // Hangi alanlar kaydedilsin? (Sadece kalıcı olanlar)
            partialize: (state) => ({
                totalFocusMinutes: state.totalFocusMinutes,
                coins: state.coins,
                currentLevelId: state.currentLevelId,
                completedChallengeIds: state.completedChallengeIds,
                inventory: state.inventory,
                selectedPotId: state.selectedPotId
            }),
        }
    )
);