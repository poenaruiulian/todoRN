import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeNavigation from './components/Home'
import Lists from './components/Lists'
import Calendar from './components/Calendar'

const Tab = createBottomTabNavigator()


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name = "Home">{()=><HomeNavigation/>}</Tab.Screen>
        <Tab.Screen name = "Lists">{()=><Lists/>}</Tab.Screen>
        <Tab.Screen name = "Calendar">{()=><Calendar/>}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}


