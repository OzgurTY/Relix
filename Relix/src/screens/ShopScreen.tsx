import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { SHOP_ITEMS } from '../constants/shop';
import { useGameStore } from '../context/gameStore';

const ShopScreen = ({ navigation }: any) => {
    const { coins, inventory, buyItem, selectedPotId, equipItem } = useGameStore();

    const handleBuy = (item: any) => {
        // ... (Bu kısım aynı, mantık değişmedi)
    };

    const handlePress = (item: any) => {
        const isOwned = inventory.includes(item.id);
        const isEquipped = selectedPotId === item.id;

        if (isEquipped) return; 

        if (isOwned) {
            equipItem(item.id);
            Alert.alert("Eşya Değişti", `${item.name} artık bahçende! 🌱`);
        } else {
            if (coins < item.price) {
                Alert.alert("Yetersiz Bakiye", "Daha fazla odaklanıp coin kazanmalısın.");
                return;
            }
            const success = buyItem(item.id, item.price);
            if (success) {
                Alert.alert("Satın Alındı", "Şimdi 'KULLAN' diyerek takabilirsin.");
            }
        }
    };

    const renderItem = ({ item }: any) => {
        const isOwned = inventory.includes(item.id);
        const isEquipped = selectedPotId === item.id;

        // BUTON STİL MANTIĞI (Düzeltilen Kısım)
        let buttonText = `${item.price} 🪙`;
        let buttonBgColor = COLORS.primary; // Varsayılan: Yeşil
        let buttonTextColor = COLORS.textLight; // Varsayılan: Beyaz

        if (isEquipped) {
            buttonText = "AKTİF"; // "KULLANILDI" yerine daha kısa "AKTİF"
            buttonBgColor = COLORS.disabled; // Açık Gri
            buttonTextColor = COLORS.textDim; // Koyu Gri (Okunabilirlik için)
        } else if (isOwned) {
            buttonText = "KULLAN";
            buttonBgColor = COLORS.secondary; // Toprak Rengi
            buttonTextColor = COLORS.textLight; // Beyaz
        }

        return (
            <View style={styles.card}>
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                </View>
                <Text style={styles.itemName}>{item.name}</Text>

                <TouchableOpacity
                    style={[styles.buyButton, { backgroundColor: buttonBgColor }]}
                    onPress={() => handlePress(item)}
                    disabled={isEquipped}
                >
                    <Text style={[styles.buttonText, { color: buttonTextColor }]}>
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Üst Bar */}
            <View style={styles.header}>
                {/* Geri butonu artık tab bar olduğu için opsiyonel ama durabilir */}
                <Text style={styles.title}>Mağaza</Text>
                <View style={styles.coinBadge}>
                    <Text style={styles.coinText}>{coins} 🪙</Text>
                </View>
            </View>

            <FlatList
                data={SHOP_ITEMS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.card,
        elevation: 2, // Android gölge
        shadowColor: '#000', // iOS gölge
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
    backButton: { padding: 10 },
    backText: { fontSize: 16, color: COLORS.text },
    
    coinBadge: { 
        backgroundColor: COLORS.accent, // Coin rengiyle uyumlu turuncu zemin
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20 
    },
    coinText: { 
        fontWeight: 'bold', 
        color: COLORS.white // Turuncu üstüne beyaz yazı
    },

    listContent: { padding: 10 },
    card: {
        flex: 1,
        backgroundColor: COLORS.card,
        margin: 8,
        borderRadius: 16, // Biraz daha yumuşak köşeler
        padding: 12,
        alignItems: 'center',
        
        // Kart Gölgesi
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        height: 100, // Görsel alanı büyüttüm
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImage: { width: 60, height: 60 },
    itemName: { 
        fontWeight: 'bold', 
        fontSize: 16,
        marginBottom: 8, 
        color: COLORS.text 
    },
    buyButton: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: { 
        fontWeight: 'bold', 
        fontSize: 13 
    },
});

export default ShopScreen;