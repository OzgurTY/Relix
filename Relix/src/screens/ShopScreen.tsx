import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { SHOP_ITEMS } from '../constants/shop';
import { useGameStore } from '../context/gameStore';

const ShopScreen = ({ navigation }: any) => {
    const { coins, inventory, buyItem, selectedPotId, equipItem } = useGameStore();

    const handleBuy = (item: any) => {
        if (inventory.includes(item.id)) {
            Alert.alert("Zaten Var", "Bu ürüne zaten sahipsin.");
            return;
        }

        if (coins < item.price) {
            Alert.alert("Yetersiz Bakiye", `Bunu almak için ${item.price - coins} coin daha lazım.`);
            return;
        }

        const success = buyItem(item.id, item.price);
        if (success) {
            Alert.alert("Hayırlı Olsun! 🎉", `${item.name} envanterine eklendi.`);
        }
    };

    const handlePress = (item: any) => {
        const isOwned = inventory.includes(item.id);
        const isEquipped = selectedPotId === item.id;

        if (isEquipped) return; // Zaten takılıysa bir şey yapma

        if (isOwned) {
            // Sahipsek -> Tak (Equip)
            equipItem(item.id);
            Alert.alert("Eşya Değişti", `${item.name} artık bahçende! 🌱`);
        } else {
            // Sahip değilsek -> Satın Al (Buy)
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
        const isEquipped = selectedPotId === item.id; // Şu an bu mu takılı?

        // Buton Metni ve Stili Ayarlama
        let buttonText = `${item.price} 🪙`;
        let buttonStyle = styles.buyButton;

        if (isOwned) {
            buttonText = "KULLAN";
            buttonStyle = { ...styles.buyButton, backgroundColor: COLORS.secondary }; // Kahverengi
        }
        if (isEquipped) {
            buttonText = "KULLANILDI";
            buttonStyle = { ...styles.buyButton, backgroundColor: '#ccc' }; // Gri (Pasif)
        }

        return (
            <View style={styles.card}>
                {/* ... Resim ve İsim aynı ... */}
                <View style={styles.imageContainer}>
                    <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                </View>
                <Text style={styles.itemName}>{item.name}</Text>

                <TouchableOpacity
                    style={buttonStyle}
                    onPress={() => handlePress(item)}
                    disabled={isEquipped} // Zaten takılıysa basılmasın
                >
                    <Text style={styles.buttonText}>{buttonText}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Üst Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Geri</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Mağaza</Text>
                <View style={styles.coinBadge}>
                    <Text style={styles.coinText}>{coins} 🪙</Text>
                </View>
            </View>

            {/* Ürün Listesi */}
            <FlatList
                data={SHOP_ITEMS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2} // Yan yana 2 ürün
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
        backgroundColor: COLORS.white,
        elevation: 2,
    },
    title: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
    backButton: { padding: 10 },
    backText: { fontSize: 16, color: COLORS.text },
    coinBadge: { backgroundColor: COLORS.background, padding: 8, borderRadius: 12 },
    coinText: { fontWeight: 'bold', color: COLORS.primary },

    listContent: { padding: 10 },
    card: {
        flex: 1,
        backgroundColor: COLORS.white,
        margin: 8,
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        height: 80,
        width: 80,
        backgroundColor: '#f0f0f0',
        borderRadius: 40,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemImage: { width: 50, height: 50 },
    itemName: { fontWeight: 'bold', marginBottom: 8, color: COLORS.text },
    buyButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    ownedButton: { backgroundColor: '#ccc' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});

export default ShopScreen;