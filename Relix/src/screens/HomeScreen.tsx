import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { LEVELS } from '../constants/levels';
import { useGameStore } from '../context/gameStore';
import { useGameLogic } from '../hooks/useGameLogic';
import { SHOP_ITEMS } from '../constants/shop';

// Yardımcı: Saniyeyi "25:00" formatına çevirir
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const HomeScreen = ({ navigation }: any) => {
  // STORE'DAN VERİLERİ ÇEKİYORUZ (Hatanın sebebi burasıydı, currentLevelId eksikti)
  const {
    status,
    timeLeft,
    coins,
    startSession,
    stopSession,
    currentLevelId,
    totalFocusMinutes,
    completedChallengeIds,
    selectedPotId
  } = useGameStore();

  // Oyun motorunu başlat
  useGameLogic();

  // Aktif Level Ayarını Bul
  // Eğer store'daki ID levels dosyasında yoksa (hata koruması), ilk leveli al.
  const currentLevelConfig = LEVELS.find(l => l.id === currentLevelId);
  const activeLevel = currentLevelConfig || LEVELS[0];

  // Progress Bar Hesabı
  // (Toplam Dakika / Gereken Dakika) * 100
  const progressPercent = Math.min((totalFocusMinutes / activeLevel.requiredMinutes) * 100, 100);

  const handleStart = () => {
    // TEST İÇİN: 0.1 dakika (6 saniye)
    startSession(0.1);
  };

  const handleGiveUp = () => {
    Alert.alert(
      "Pes mi ediyorsun?",
      "Eğer şimdi çıkarsan ağacın büyümesi duracak.",
      [
        { text: "Vazgeç", style: "cancel" },
        { text: "Bitir", style: "destructive", onPress: () => stopSession() }
      ]
    );
  };

  const currentChallenge = activeLevel.challenges.find(ch => !completedChallengeIds.includes(ch.id));

  // Seçili saksının görselini bul. Bulamazsan levelin varsayılanını kullan.
  const selectedPotItem = SHOP_ITEMS.find(i => i.id === selectedPotId);
  const activePotImage = selectedPotItem ? selectedPotItem.image : activeLevel.assets.plantPot;

  return (
    <ImageBackground
      source={activeLevel.assets.background}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>

        {/* Üst Panel & Progress Bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.levelTitle}>{activeLevel.name}</Text>

            {/* PROGRESS BAR */}
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {totalFocusMinutes} / {activeLevel.requiredMinutes} dk
            </Text>

            {/* GÖREV KUTUSU */}
            {currentChallenge ? (
              <View style={styles.challengeBox}>
                <Text style={styles.challengeTitle}>🎯 Görev:</Text>
                <Text style={styles.challengeDesc}>{currentChallenge.description}</Text>
              </View>
            ) : (
              <Text style={styles.allDoneText}>Tüm görevler tamam! Sadece süre kas. ⏳</Text>
            )}
          </View>

          {/* Sağ Taraf: Coin & Mağaza */}
          <View style={{ alignItems: 'flex-end' }}>
            {/* Coin Badge */}
            <View style={styles.coinContainer}>
              <Text style={styles.coinText}>{coins} 🪙</Text>
            </View>
          </View>
        </View>

        {/* Orta Alan: Bitki */}
        <View style={styles.gardenArea}>
          {status === 'failed' && (
            <Text style={[styles.statusText, { color: COLORS.danger }]}>Ağacın Kurudu! 🥀</Text>
          )}

          {status === 'completed' && (
            <Text style={[styles.statusText, { color: COLORS.primary }]}>Tebrikler! 🎉</Text>
          )}

          {/* Saksı */}
          <Image
            source={activePotImage}
            style={styles.potImage}
            resizeMode="contain"
          />

          {/* Fidan */}
          {(status === 'running' || status === 'completed') && (
            <Image
              source={require('../assets/images/icon_start_focus.png')}
              style={[
                styles.plantImage,
                { transform: [{ scale: status === 'completed' ? 1.5 : 0.8 }] }
              ]}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Alt Alan */}
        <View style={styles.footer}>
          {status === 'running' ? (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              <TouchableOpacity onPress={handleGiveUp} style={styles.giveUpButton}>
                <Text style={styles.giveUpText}>Vazgeç</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Image
                source={require('../assets/images/icon_start_focus.png')}
                style={styles.icon}
              />
              <Text style={styles.buttonText}>
                {status === 'failed' ? 'TEKRAR DENE' : 'ODAKLAN'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: 'space-between' },
  header: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  levelTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, textShadowColor: 'rgba(255,255,255,0.5)', textShadowRadius: 10 },

  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 4,
    marginTop: 5,
    width: 150,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 2,
  },

  coinContainer: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  coinText: { fontWeight: 'bold', color: COLORS.primary },

  gardenArea: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  potImage: { width: 220, height: 220, position: 'absolute', bottom: 100 },
  plantImage: { width: 100, height: 100, position: 'absolute', bottom: 250 },
  statusText: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.8)', padding: 10, borderRadius: 10, overflow: 'hidden' },

  footer: { padding: 30, alignItems: 'center', paddingBottom: 50 },
  startButton: { backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 30, elevation: 5 },
  icon: { width: 24, height: 24, marginRight: 10, tintColor: 'white' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },

  timerContainer: { alignItems: 'center' },
  timerText: { fontSize: 60, fontWeight: 'bold', color: COLORS.text, fontFamily: 'Courier' },
  giveUpButton: { marginTop: 20, padding: 10 },
  giveUpText: { color: COLORS.danger, fontSize: 16, textDecorationLine: 'underline' },
  challengeBox: {
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 8,
    borderRadius: 8,
    maxWidth: 200,
  },
  challengeTitle: {
    fontWeight: 'bold',
    color: COLORS.text,
    fontSize: 12,
  },
  challengeDesc: {
    color: COLORS.text,
    fontSize: 12,
  },
  allDoneText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: COLORS.text,
    fontSize: 12,
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
  },
  resetText: {
    color: 'rgba(0,0,0,0.3)', // Silik görünsün
    fontSize: 10,
  },
  shopButton: {
    marginTop: 8,
    backgroundColor: COLORS.accent || '#FFB74D', // Accent rengi yoksa turuncu
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default HomeScreen;