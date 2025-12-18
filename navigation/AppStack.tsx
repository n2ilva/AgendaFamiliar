import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HomeScreen from '@screens/app/HomeScreen';
import CalendarScreen from '@screens/app/CalendarScreen';
import SettingsScreen from '@screens/app/SettingsScreen';
import AddEditScreen from '@screens/app/AddEditScreen';
import ApprovalsScreen from '@screens/app/ApprovalsScreen';
import FamilyMembersScreen from '@screens/app/FamilyMembersScreen';
import { useThemeColors } from '@hooks/useThemeColors';
import { useUserStore } from '@store/userStore';
import { familyService } from '@services/familyService';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Helper function to get standardized header options
const getHeaderOptions = (colors: any, title: string, options?: any) => ({
  title,
  headerTitleAlign: 'center' as const,
  headerStyle: {
    backgroundColor: colors.background,
    height: 70,
  },
  headerTitleContainerStyle: {
    justifyContent: 'center' as const,
  },
  ...options,
});

function SettingsStack() {
  const colors = useThemeColors();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="SettingsMain" component={SettingsScreen} options={getHeaderOptions(colors, 'Configurações')} />
      <Stack.Screen
        name="FamilyMembers"
        component={FamilyMembersScreen}
        options={{ title: 'Membros da Família' }}
      />
      <Stack.Screen
        name="Approvals"
        component={ApprovalsScreen}
        options={{ title: 'Aprovações' }}
      />
    </Stack.Navigator>
  );
}

function NotificationBadge() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const user = useUserStore((state) => state.user);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!user?.familyId || user.role !== 'admin') {
      setPendingCount(0);
      return;
    }

    const unsubscribe = familyService.subscribeToApprovals(user.familyId, (approvals) => {
      setPendingCount(approvals.length);
    });

    return () => unsubscribe();
  }, [user?.familyId, user?.role]);

  // Always show icon for admins, only hide badge when count is 0
  if (user?.role !== 'admin') return null;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Approvals' as never)}
      style={{ marginRight: 15, position: 'relative' }}
    >
      <Ionicons name="notifications-outline" size={24} color={colors.text} />
      {pendingCount > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.danger }]}>
          <Text style={styles.badgeText}>{pendingCount > 9 ? '9+' : pendingCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function HomeStack() {
  const colors = useThemeColors();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="HomeStack"
        component={HomeScreen}
        options={getHeaderOptions(colors, 'Tarefas', {
          headerRight: () => <NotificationBadge />,
        })}
      />
      <Stack.Screen
        name="AddEdit"
        component={AddEditScreen}
        options={{ title: 'Editar Tarefa' }}
      />
      <Stack.Screen
        name="Approvals"
        component={ApprovalsScreen}
        options={{ title: 'Aprovações' }}
      />
    </Stack.Navigator>
  );
}

function CalendarStack() {
  const colors = useThemeColors();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          color: colors.text,
        },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="CalendarMain"
        component={CalendarScreen}
        options={getHeaderOptions(colors, 'Calendário')}
      />
      <Stack.Screen
        name="AddEdit"
        component={AddEditScreen}
        options={{ title: 'Editar Tarefa' }}
      />
    </Stack.Navigator>
  );
}

export default function AppStack() {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'home';
          if (route.name === 'Home') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Calendar') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} options={{ title: 'Tarefas' }} />
      <Tab.Screen name="Calendar" component={CalendarStack} options={{ title: 'Calendário' }} />
      <Tab.Screen name="Settings" component={SettingsStack} options={{ title: 'Configurações' }} />
    </Tab.Navigator>
  );
}
