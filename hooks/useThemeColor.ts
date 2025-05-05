/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export async function saveToStorage(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Failed to save to storage', e);
  }
}

export async function getFromStorage(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error('Failed to fetch from storage', e);
    return null;
  }
}
