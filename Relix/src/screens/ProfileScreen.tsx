import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useGameStore } from '../context/gameStore';
import { LEVELS } from '../constants/levels';

const ProfileScreen = () => {
  const { totalFocusMinutes, coins, currentLevelId, resetProgress, inventory } = useGameStore();

  const currentLevel = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];

  const handleReset = () => {
    Alert.alert(
      "DİKKAT! ⚠️",
      "Tüm ilerlemen, coinlerin ve eşyaların silinecek. Emin misin?",
      [
        { text: "Vazgeç", style: "cancel" },
        { text: "Evet, Sıfırla", style: "destructive", onPress: () => resetProgress() }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Profilim</Text>

        {/* Üst Kart: Kullanıcı Özeti */}
        <View style={styles.userCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <View>
            <Text style={styles.userName}>Bahçıvan</Text>
            <Text style={styles.userLevel}>{currentLevel.name} (Lvl {currentLevelId})</Text>
          </View>
        </View>

        {/* İstatistik Izgarası */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalFocusMinutes} dk</Text>
            <Text style={styles.statLabel}>Toplam Odak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{coins}</Text>
            <Text style={styles.statLabel}>Coin</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{inventory.length}</Text>
            <Text style={styles.statLabel}>Eşya</Text>
          </View>
        </View>

        {/* Ayarlar Bölümü */}
        <Text style={styles.sectionTitle}>Ayarlar</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🔔 Bildirimler (Yakında)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🎵 Ses Ayarları (Yakında)</Text>
        </TouchableOpacity>

        {/* TEHLİKELİ BÖLGE */}
        <TouchableOpacity style={[styles.menuItem, styles.dangerItem]} onPress={handleReset}>
          <Text style={styles.dangerText}>🗑️ Tüm İlerlemeyi Sıfırla</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Relix v1.0.0 (Alpha)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 20 },
  
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 60, height: 60,
    backgroundColor: COLORS.background,
    borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { fontSize: 30 },
  userName: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  userLevel: { color: COLORS.primary, fontWeight: '600' },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statBox: {
    backgroundColor: COLORS.white,
    width: '30%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 12, color: '#888', marginTop: 5 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
  menuItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: { fontSize: 16, color: COLORS.text },
  
  dangerItem: { backgroundColor: '#FFEBEE', borderWidth: 1, borderColor: '#FFCDD2' },
  dangerText: { color: COLORS.danger, fontWeight: 'bold' },
  
  versionText: { textAlign: 'center', color: '#ccc', marginTop: 20 },
});

export default ProfileScreen;