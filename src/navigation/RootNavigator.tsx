import { NavigationContainer, DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserStore } from '@store/userStore';
import { Colors } from '@styles/colors';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import FamilySetupScreen from '@screens/auth/FamilySetupScreen';

const Stack = createStackNavigator();

const MyLightTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.warning,
  },
};

const MyDarkTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.warning,
  },
};

export default function RootNavigator() {
  const user = useUserStore((state) => state.user);
  const preferences = useUserStore((state) => state.preferences);
  const systemScheme = useColorScheme();

  const activeTheme = (!preferences?.theme || preferences.theme === 'system')
    ? systemScheme
    : preferences.theme;

  const navigationTheme = activeTheme === 'dark' ? MyDarkTheme : MyLightTheme;

  if (!user) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <AuthStack />
      </NavigationContainer>
    );
  }

  // If user exists but has no familyId, show setup
  if (!user.familyId) {
    return (
      <NavigationContainer theme={navigationTheme}>
        <FamilySetupScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppStack />
    </NavigationContainer>
  );
}
