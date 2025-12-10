import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

// Zustand için AsyncStorage adaptörü
// MMKV senkron çalışır, AsyncStorage asenkron çalışır.
// Zustand her ikisini de destekler.

export const zustandStorage: StateStorage = {
  setItem: async (name, value) => {
    return await AsyncStorage.setItem(name, value);
  },
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  removeItem: async (name) => {
    return await AsyncStorage.removeItem(name);
  },
};