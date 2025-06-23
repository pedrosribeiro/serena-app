import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import DispenserScreen from './dispenser';
import HomeScreen from './index';
import PrescriptionsScreen from './prescriptions';
import ReportsScreen from './reports';
import SettingsScreen from './settings';
import SymptomsScreen from './symptoms';

export const unstable_settings = { initialRouteName: 'Home' };

export const screenOptions = {
  headerShown: false,
};

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const theme = useTheme();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;

  const caregiverTabs = [
    { name: 'Home', component: HomeScreen, title: 'Início' },
    { name: 'Prescriptions', component: PrescriptionsScreen, title: 'Receitas' },
    { name: 'Symptoms', component: SymptomsScreen, title: 'Sintomas' },
    { name: 'Reports', component: ReportsScreen, title: 'Relatórios' },
    { name: 'Dispenser', component: DispenserScreen, title: 'Dispenser' },
    { name: 'Settings', component: SettingsScreen, title: 'Configurações' },
  ];
  const doctorTabs = [
    { name: 'Home', component: HomeScreen, title: 'Início' },
    { name: 'Prescriptions', component: PrescriptionsScreen, title: 'Receitas' },
    { name: 'Symptoms', component: SymptomsScreen, title: 'Sintomas' },
    { name: 'Reports', component: ReportsScreen, title: 'Relatórios' },
    { name: 'Settings', component: SettingsScreen, title: 'Configurações' },
  ];
  const tabs = user?.role === 'doctor' ? doctorTabs : caregiverTabs;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconSize = isSmallScreen ? 20 : size;
          let icon;
          if (route.name === 'Home') {
            icon = <MaterialIcons name="home" size={iconSize} color={focused ? '#fff' : color} />;
          } else if (route.name === 'Prescriptions') {
            icon = <FontAwesome5 name="pills" size={iconSize} color={focused ? '#fff' : color} />;
          } else if (route.name === 'Symptoms') {
            icon = <MaterialIcons name="sick" size={iconSize} color={focused ? '#fff' : color} />;
          } else if (route.name === 'Reports') {
            icon = <Ionicons name="document-text-outline" size={iconSize} color={focused ? '#fff' : color} />;
          } else if (route.name === 'Dispenser') {
            icon = <MaterialIcons name="medication" size={iconSize} color={focused ? '#fff' : color} />;
          } else if (route.name === 'Settings') {
            icon = <Ionicons name="settings-outline" size={iconSize} color={focused ? '#fff' : color} />;
          }
          return (
            <View style={{ alignItems: 'center', justifyContent: 'center', width: isSmallScreen ? 48 : 56 }}>
              {focused ? (
                <View style={{ backgroundColor: '#2bb3c0', borderRadius: 18, padding: isSmallScreen ? 6 : 8, marginBottom: 2, shadowColor: '#2bb3c0', shadowOpacity: 0.18, shadowRadius: 8, elevation: 4 }}>
                  {icon}
                </View>
              ) : (
                <View style={{ marginBottom: isSmallScreen ? 6 : 10 }}>{icon}</View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: '#2bb3c0',
        tabBarInactiveTintColor: '#b0c4d4',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          height: isSmallScreen ? 60 : 74,
          paddingBottom: isSmallScreen ? 4 : 12,
          shadowColor: '#2bb3c0',
          shadowOpacity: 0.10,
          shadowRadius: 12,
          elevation: 10,
        },
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              fontSize: isSmallScreen ? 10 : 12,
              fontFamily: focused ? 'Montserrat-Bold' : 'Montserrat-Regular',
              color: focused ? '#2bb3c0' : '#b0c4d4',
              marginTop: 0,
              textAlign: 'center',
              width: isSmallScreen ? 60 : 80,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {/* Mostra o título traduzido da aba */}
            {tabs.find(t => t.name === route.name)?.title || route.name}
          </Text>
        ),
      })}
    >
      {tabs.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} options={{ title: tab.title }} />
      ))}
    </Tab.Navigator>
  );
}
