import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeNavigation from './components/Home'
import ListsNavigation from './components/Lists'
import Calendar from './components/Calendar'

const Tab = createBottomTabNavigator()


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name = "Home" options={{headerShown:false,unmountOnBlur:true}} >{()=><HomeNavigation/>}</Tab.Screen>
        <Tab.Screen name = "Lists" options={{headerShown:false,unmountOnBlur:true}}>{()=><ListsNavigation/>}</Tab.Screen>
        <Tab.Screen name = "Calendar" options={{headerShown:false,unmountOnBlur:true}}>{()=><Calendar/>}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}


