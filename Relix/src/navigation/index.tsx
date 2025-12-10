import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ShopScreen from '../screens/ShopScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../constants/colors';

// Tab Parametreleri
const Tab = createBottomTabNavigator();

// İkon yerine şimdilik Emoji kullanacağız (Hızlı çözüm)
// İleride buraya SVG veya PNG ikonlar koyacağız
const getIcon = (routeName: string, focused: boolean) => {
  let iconName = '';
  if (routeName === 'Garden') iconName = '🏠'; // Bahçe
  if (routeName === 'Shop') iconName = '🛒';   // Mağaza
  if (routeName === 'Profile') iconName = '👤'; // Profil
  
  return <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{iconName}</Text>;
};

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false, // Üstteki varsayılan başlığı gizle
          tabBarIcon: ({ focused }) => getIcon(route.name, focused),
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderTopWidth: 0,
            elevation: 10, // Android gölge
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          }
        })}
      >
        <Tab.Screen name="Garden" component={HomeScreen} options={{ title: 'Bahçe' }} />
        <Tab.Screen name="Shop" component={ShopScreen} options={{ title: 'Mağaza' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}