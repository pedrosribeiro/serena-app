import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
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
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <MaterialIcons name="home" size={size} color={color} />;
          } else if (route.name === 'Prescriptions') {
            return <FontAwesome5 name="pills" size={size} color={color} />;
          } else if (route.name === 'Symptoms') {
            return <MaterialIcons name="sick" size={size} color={color} />;
          } else if (route.name === 'Reports') {
            return <Ionicons name="document-text-outline" size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <Ionicons name="settings-outline" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#2bb3c0',
        tabBarInactiveTintColor: '#b0c4d4',
        tabBarStyle: {
          backgroundColor: '#f8fcff',
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Montserrat-Regular',
          maxWidth: 60,
          textAlign: 'center',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Prescriptions" component={PrescriptionsScreen} options={{ title: 'Prescriptions' }} />
      <Tab.Screen name="Symptoms" component={SymptomsScreen} options={{ title: 'Symptoms' }} />
      <Tab.Screen name="Reports" component={ReportsScreen} options={{ title: 'Reports' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}
