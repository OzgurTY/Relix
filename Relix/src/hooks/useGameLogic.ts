import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useGameStore } from '../context/gameStore';

export const useGameLogic = () => {
  const { status, tick, failSession } = useGameStore();
  const appState = useRef(AppState.currentState);

  // 1. ZAMANLAYICI MANTIĞI (Timer Loop)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === 'running') {
      interval = setInterval(() => {
        tick();
      }, 1000); // Her 1 saniyede bir tetikle
    }

    return () => clearInterval(interval);
  }, [status, tick]);

  // 2. ARKA PLAN KONTROLÜ (Background Detection)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Eğer oyun çalışıyorsa VE kullanıcı uygulamayı arka plana attıysa
      if (status === 'running' && nextAppState.match(/inactive|background/)) {
        // BURADA: İleride 5 saniye tolerans ekleyeceğiz (Emergency Mode)
        // Şimdilik acımasız mod: Direkt yakıyoruz!
        console.log("Kullanıcı kaçtı! Ağaç kurudu.");
        failSession();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [status, failSession]);
};